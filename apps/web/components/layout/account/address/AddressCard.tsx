// components/account/address/AddressCard.tsx

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onDefault,
}: any) {
  return (
    <div className="border rounded-xl p-4 bg-white relative">
      {address.is_default && (
        <span className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded">
          Default
        </span>
      )}

      <p className="font-medium">{address.address_line1}</p>
      <p className="text-sm text-gray-500">
        {address.city}, {address.country}
      </p>

      <div className="flex gap-3 mt-3 text-sm">
        <button onClick={() => onEdit(address)}>Edit</button>
        <button onClick={() => onDelete(address.id)}>Delete</button>

        {!address.is_default && (
          <button onClick={() => onDefault(address.id)}>
            Set Default
          </button>
        )}
      </div>
    </div>
  );
}