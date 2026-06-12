// packages/ui/src/toast.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toast } from "react-bootstrap";
/* const toastStyles: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  primary: "bg-blue-600",
}; */
export function ToastContainer({ toasts }) {
    return (_jsx("div", { className: "fixed top-4 right-2 z-[9999] space-y-3", children: toasts.map((toast) => (_jsxs(Toast, { className: `colored-toast bg-${toast.type}-transparent`, delay: 3000, autohide: true, children: [_jsx(Toast.Header, { closeButton: true, className: `px-2 rounded-md bg-${toast.type}  text-white py-2 pl-5 pr-10 shadow-lg`, children: _jsx("strong", { className: "me-auto capitalize", children: toast.type }) }), _jsx(Toast.Body, { className: "py-2 px-2 pl-5 pr-10 capitalize", children: toast.message })] }, toast.id))) }));
}
