export function formatPrice(amount: number) {
  return `$${(amount / 100).toFixed(2)}`
}

export const formatCurrency = (
  amount: number,
  symbol: string,
  decimals: number = 2
) => {
  return `${symbol} ${amount.toFixed(decimals)}`;
};


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useZodForm(schema: any, defaultValues = {}) {
  return useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
}