import { MapPin } from "lucide-react";

export default function Step({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center
        ${active ? "bg-orange-500 text-white" : "border text-gray-400"}`}
      >
        ●
      </div>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
