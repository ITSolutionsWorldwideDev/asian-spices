import Image from "next/image";
export default function OrderSummary({
  items,
  subtotal,
  //   shipping,
  //   tax,
  total,
}: any) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="font-semibold mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-14 w-14 rounded-lg overflow-hidden">
              <Image
                src={`/${item.image}`}
                alt={item.title}
                fill
                className="object-cover"
              />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-500">{item.weight}</p>
            </div>

            <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm border-t pt-4">
        <div className="flex justify-between text-gray-600">
          <span>{items.label}</span>
          <span>${items.value}</span>
          {/* .toFixed(2) */}
        </div>
        {/* <Row label="Shipping" value={shipping} /> */}
        {/* <Row label="Tax" value={tax} /> */}
      </div>

      <div className="flex justify-between text-lg font-semibold mt-6">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
