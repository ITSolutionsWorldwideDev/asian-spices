import Modal from "@/components/Modal";

export default function AddCategoryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Add Category">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category Slug</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Add Category
          </button>
        </div>
      </form>
    </Modal>
  );
}
