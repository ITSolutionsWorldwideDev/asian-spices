// components/layout/account/UserMenu.tsx
"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function UserMenu({ email }: { email?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative right-0 ">
      <div className="absolute right-0 -top-8">
      {/* Avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center "
      >
        {email?.charAt(0).toUpperCase() || "U"}
      </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg p-2 z-50">
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}