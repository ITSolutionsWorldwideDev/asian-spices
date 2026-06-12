// packages/ui/src/toast-provider.tsx
"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { ToastContainer } from "./toast";
const ToastContext = React.createContext(null);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([]);
    const showToast = (type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 9000);
    };
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, _jsx(ToastContainer, { toasts: toasts })] }));
}
export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside ToastProvider");
    }
    return ctx;
}
