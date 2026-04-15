// packages/order-routing/index.ts
import { AppError } from "./errors";

/* ================= TYPES ================= */

type StoreCandidate = {
  store_id: string;
  total_price: number;
  latitude: number;
  longitude: number;
  country: string;
};

type StoreWithDistance = StoreCandidate & {
  distance: number;
};

/* ================= CONSTANTS ================= */

export const ORDER_EVENTS = {
  ASSIGNED: "assigned",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
  PARTIAL: "partial",
  DEFAULT_ASSIGNED: "default_assigned",
  ADMIN_REASSIGN: "admin_reassign",
  ADMIN_FORCE_ASSIGN: "admin_force_assign",
  CANCELLED: "cancelled",
} as const;

// ⚠️ move to env later
const DEFAULT_STORE_ID = "afef3fd5-c31a-440a-ae56-99eca0b24359";

/* ================= CORE ================= */

// ✅ FIXED: country comes from SHIPPING ADDRESS (not store)
export const getOrderContext = async (client: any, orderId: string) => {
  const { rows } = await client.query(
    `
    SELECT 
      o.*,
      addr.country,
      addr.latitude,
      addr.longitude
    FROM store_orders o
    JOIN store_customer_addresses addr 
      ON addr.customer_id = o.customer_id
    WHERE o.id = $1
    ORDER BY addr.created_at DESC
    LIMIT 1
  `,
    [orderId]
  );

  if (!rows.length) {
    throw new AppError("Order not found", "ORDER_NOT_FOUND", 404);
  }

  return rows[0];
};

/* ================= STORE CANDIDATES ================= */

export const getCandidateStores = async (
  client: any,
  orderId: string,
  country: string
): Promise<StoreCandidate[]> => {
  const { rows } = await client.query(
    `
    SELECT 
      spc.store_id,
      SUM(spc.price * oi.quantity) AS total_price,
      sa.latitude,
      sa.longitude,
      sa.country
    FROM store_order_items oi
    JOIN store_product_catalog spc ON spc.product_id = oi.product_id
    JOIN store_addresses sa ON sa.store_id = spc.store_id
    WHERE oi.order_id = $1
      AND spc.status = 1
      AND sa.country = $2
    GROUP BY spc.store_id, sa.latitude, sa.longitude, sa.country
  `,
    [orderId, country]
  );

  return rows;
};

/* ================= DISTANCE ================= */

const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ================= SORTING ================= */

export const sortStores = (
  stores: StoreCandidate[],
  lat: number,
  lng: number
): StoreWithDistance[] => {
  return stores
    .map((s) => ({
      ...s,
      total_price: Number(s.total_price),
      latitude: Number(s.latitude),
      longitude: Number(s.longitude),
      distance: getDistance(lat, lng, Number(s.latitude), Number(s.longitude)),
    }))
    .sort((a, b) => {
      if (a.total_price !== b.total_price) {
        return a.total_price - b.total_price;
      }
      return a.distance - b.distance;
    });
};

/* ================= ASSIGN DEFAULT ================= */

export const assignDefaultStore = async (
  client: any,
  orderId: string
) => {
  if (!DEFAULT_STORE_ID) {
    throw new AppError(
      "Default store not configured",
      "DEFAULT_STORE_MISSING",
      500
    );
  }

  await client.query(
    `
    UPDATE store_orders
    SET current_store_id = $1,
        routing_status = 'assigned'
    WHERE id = $2
  `,
    [DEFAULT_STORE_ID, orderId]
  );

  await logOrderEvent(client, {
    orderId,
    eventType: ORDER_EVENTS.DEFAULT_ASSIGNED,
    storeId: DEFAULT_STORE_ID,
    message: "Assigned to default store",
  });
};

/* ================= MAIN ROUTING ================= */

export const assignNextStore = async (
  client: any,
  orderId: string
) => {
  try {
    const order = await getOrderContext(client, orderId);

    // ✅ retry limit
    if (order.rejection_count >= 3) {
      return assignDefaultStore(client, orderId);
    }

    const stores = await getCandidateStores(
      client,
      orderId,
      order.country
    );

    if (!stores.length) {
      return assignDefaultStore(client, orderId);
    }

    // ✅ filter open stores
    const availableStores: StoreCandidate[] = [];

    for (const store of stores) {
      const isOpen = await isStoreOpenNow(client, store.store_id);
      if (isOpen) availableStores.push(store);
    }

    if (!availableStores.length) {
      return assignDefaultStore(client, orderId);
    }

    const sorted = sortStores(
      availableStores,
      Number(order.latitude),
      Number(order.longitude)
    );

    // ✅ exclude already tried stores
    const { rows: attempts } = await client.query(
      `SELECT store_id FROM order_routing_attempts WHERE order_id = $1`,
      [orderId]
    );

    const tried = attempts.map((a: any) => a.store_id);

    const nextStore = sorted.find((s) => !tried.includes(s.store_id));

    if (!nextStore) {
      return assignDefaultStore(client, orderId);
    }

    // ✅ assign store
    await client.query(
      `
      UPDATE store_orders
      SET current_store_id = $1,
          routing_status = 'assigned'
      WHERE id = $2
    `,
      [nextStore.store_id, orderId]
    );

    // ✅ allocations (partial support)
    await createAllocations(client, orderId, nextStore.store_id);

    // ✅ track attempt
    await client.query(
      `
      INSERT INTO order_routing_attempts
      (order_id, store_id, attempt_number)
      VALUES ($1,$2,$3)
    `,
      [orderId, nextStore.store_id, attempts.length + 1]
    );

    await logOrderEvent(client, {
      orderId,
      eventType: ORDER_EVENTS.ASSIGNED,
      storeId: nextStore.store_id,
      message: "Order assigned",
      metadata: {
        price: nextStore.total_price,
        distance: nextStore.distance,
      },
    });
  } catch (err) {
    console.error("assignNextStore error:", err);
    throw err;
  }
};

/* ================= ALLOCATIONS ================= */

const createAllocations = async (
  client: any,
  orderId: string,
  storeId: string
) => {
  await client.query(
    `
    INSERT INTO order_item_allocations
    (order_item_id, store_id, allocated_quantity, fulfilled_quantity, status)
    SELECT 
      oi.id,
      $1,
      (oi.quantity - COALESCE(oi.fulfilled_quantity,0)),
      0,
      'pending'
    FROM store_order_items oi
    WHERE oi.order_id = $2
      AND (oi.quantity - COALESCE(oi.fulfilled_quantity,0)) > 0
  `,
    [storeId, orderId]
  );
};

/* ================= ORDER STATUS ================= */

export const resolveOrderStatus = async (
  client: any,
  orderId: string
) => {
  const { rows } = await client.query(
    `
    SELECT 
      SUM(quantity) as total,
      SUM(fulfilled_quantity) as fulfilled
    FROM store_order_items
    WHERE order_id = $1
  `,
    [orderId]
  );

  const total = Number(rows[0].total || 0);
  const fulfilled = Number(rows[0].fulfilled || 0);

  let orderStatus = "pending";
  let fulfillmentStatus = "pending";

  if (fulfilled === 0) {
    fulfillmentStatus = "pending";
  } else if (fulfilled < total) {
    orderStatus = "partially_confirmed";
    fulfillmentStatus = "partial";
  } else {
    orderStatus = "confirmed";
    fulfillmentStatus = "fulfilled";
  }

  await client.query(
    `
    UPDATE store_orders
    SET order_status = $1,
        fulfillment_status = $2
    WHERE id = $3
  `,
    [orderStatus, fulfillmentStatus, orderId]
  );
};

/* ================= EVENTS ================= */

export const logOrderEvent = async (
  client: any,
  {
    orderId,
    eventType,
    storeId = null,
    message = "",
    metadata = {},
  }: {
    orderId: string;
    eventType: string;
    storeId?: string | null;
    message?: string;
    metadata?: Record<string, any>;
  }
) => {
  await client.query(
    `
    INSERT INTO order_events
    (order_id, event_type, store_id, message, metadata)
    VALUES ($1,$2,$3,$4,$5)
  `,
    [orderId, eventType, storeId, message, metadata]
  );
};

/* ================= STORE STATUS ================= */

export const isStoreOpenNow = async (
  client: any,
  storeId: string
) => {
  const now = new Date();
  const day = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);

  const { rows } = await client.query(
    `
    SELECT open_time, close_time, is_closed
    FROM store_working_hours
    WHERE store_id = $1 AND day_of_week = $2
  `,
    [storeId, day]
  );

  if (!rows.length) return false;

  const wh = rows[0];
  if (wh.is_closed) return false;

  return currentTime >= wh.open_time && currentTime <= wh.close_time;
};
