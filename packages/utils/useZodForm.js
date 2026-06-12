// packages/utils/useZodForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export function useZodForm(schema, defaultValues = {}) {
    return useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });
}
