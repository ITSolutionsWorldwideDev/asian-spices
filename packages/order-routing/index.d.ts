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
export declare const ORDER_EVENTS: {
    readonly CREATED: "created";
    readonly ASSIGNED: "assigned";
    readonly REJECTED: "rejected";
    readonly ACCEPTED: "accepted";
    readonly PARTIAL: "partial";
    readonly DEFAULT_ASSIGNED: "default_assigned";
    readonly ADMIN_REASSIGN: "admin_reassign";
    readonly ADMIN_FORCE_ASSIGN: "admin_force_assign";
    readonly CANCELLED: "cancelled";
};
export declare const getOrderContext: (client: any, orderId: string) => Promise<any>;
export declare const getCandidateStores: (client: any, orderId: string, country: string) => Promise<StoreCandidate[]>;
export declare const sortStores: (stores: StoreCandidate[], lat: number, lng: number) => StoreWithDistance[];
export declare const assignDefaultStore: (client: any, orderId: string) => Promise<void>;
export declare const resolveOrderStatus: (client: any, orderId: string) => Promise<void>;
export declare const logOrderEvent: (client: any, { orderId, eventType, storeId, message, metadata, }: {
    orderId: string;
    eventType: string;
    storeId?: string | null;
    message?: string;
    metadata?: Record<string, any>;
}) => Promise<void>;
export declare const isStoreOpenNow: (client: any, storeId: string) => Promise<boolean>;
export declare const isTimeoutExceeded: (client: any, attempt: any) => Promise<boolean>;
export declare const assignNextStore: (client: any, orderId: string) => Promise<void | {
    success: boolean;
    type: string;
} | {
    success: boolean;
    type: string;
    store_id: string;
}>;
export declare const assignMultiStore: (client: any, orderId: string) => Promise<{
    success: boolean;
    type: string;
}>;
export declare const getStoresThatCanFulfillAllItems: (client: any, orderId: string, country: string) => Promise<any>;
export declare const getStoresWithPartialItems: (client: any, orderId: string, country: string) => Promise<any>;
export {};
