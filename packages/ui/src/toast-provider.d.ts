import * as React from "react";
import type { ToastType } from "@acme/types";
interface ToastContextValue {
    showToast: (type: ToastType, message: string) => void;
}
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): ToastContextValue;
export {};
