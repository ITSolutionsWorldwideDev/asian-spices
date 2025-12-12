"use client";

import { Menu } from "@headlessui/react";
import Link from "next/link";

export default function FilterBar() {
  const filterItems = {
    product: ["Lenovo IdeaPad 3", "Beats Pro", "Nike Jordan", "Apple Series 5"],
    createdBy: ["James Kirwin", "Francis Chang", "Antonio Engle", "Leo Kelly"],
    category: ["Computers", "Electronics", "Shoe", "Electronics 2"],
    brand: ["Lenovo", "Beats", "Nike", "Apple"],
    sort: ["Recently Added", "Ascending", "Descending", "Last Month", "Last 7 Days"],
  };

  return (
    <div className="flex flex-wrap gap-2 align-items-center">
      {/* Reusable dropdown */}
      {Object.entries(filterItems).map(([label, items]) => (
        <Menu key={label} as="div" className="relative inline-block text-right">
          <Menu.Button className="px-3 py-2 bg-white border rounded-md shadow-sm text-sm hover:bg-gray-50">
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border focus:outline-none z-50">
            {items.map((item) => (
              <Menu.Item key={item}>
                {({ active }) => (
                  <Link
                    href="#"
                    className={`block px-4 py-2 text-sm rounded-md ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {item}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      ))}
    </div>
  );
}
