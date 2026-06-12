// packages/ui/src/button.tsx
"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { clsx } from "clsx";
const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};
const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};
export const Button = React.forwardRef(function Button({ className, variant = "primary", size = "md", type = "button", ...props }, ref) {
    return (_jsx("button", { ref: ref, type: type, className: clsx(baseStyles, variantStyles[variant], sizeStyles[size], className), ...props }));
});
