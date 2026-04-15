// apps/web/components/layout/account/Modal.tsx

"use client";

export default function Modal({ open, onClose, children }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <button onClick={onClose} className="float-right">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}