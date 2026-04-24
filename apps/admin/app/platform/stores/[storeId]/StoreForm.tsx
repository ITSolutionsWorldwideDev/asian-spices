// apps/admin/app/platform/stores/[storeId]/StoreForm.tsx

"use client";

import { useTransition, useState } from "react";
import { saveStore } from "@/components/platform/stores/actions";
import Link from "next/link";
import { ArrowLeft } from "react-feather";
// import { Building2, MapPin } from "lucide-react";
// import UploadDocument from "./UploadDocument";

export default function StoreForm({ store }: { store?: any }) {
  const [pending, startTransition] = useTransition();

  const isEdit = !!store;

  // -----------------------
  // STATE INITIALIZATION
  // -----------------------
  const [formState, setFormState] = useState({
    name: store?.name || "",
    slug: store?.slug || "",
    kvkNumber: store?.kvkNumber || "",
    companyName: store?.companyName || "",
    chamberOfCommerceNumber: store?.chamberOfCommerceNumber || "",
    country: store?.country || "",
    street: store?.street || "",
    houseNumber: store?.houseNumber || "",
    addition: store?.addition || "",
    postalCode: store?.postalCode || "",
    city: store?.city || "",
    firstName: store?.firstName || "",
    middleName: store?.middleName || "",
    lastName: store?.lastName || "",
    businessPhone: store?.businessPhone || "",
    businessEmail: store?.businessEmail || "",
    vatNumber: store?.vatNumber || "",
    status: store?.status || "active",
  });

  // Local state to manage the slug based on the name
  // const [slug, setSlug] = useState(store?.slug || "");
  // const [name, setName] = useState(store?.name || "");
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit);

  // Helper to convert text to URL-friendly slug
  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-"); // Replace multiple - with single -
  };

  // -----------------------
  // HANDLER
  // -----------------------
  const handleChange = (key: string, value: any) => {
    setFormState((prev) => {
      const updated = { ...prev, [key]: value };

      if (!isEdit && key === "name") {
        updated.slug = generateSlug(value);
      }

      return updated;
    });
  };

  // -----------------------
  // SUBMIT HANDLER (FIXED)
  // -----------------------
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        // append controlled state into formData
        Object.entries(formState).forEach(([key, value]) => {
          formData.set(key, String(value ?? ""));
        });

        const result = await saveStore(store?.id, formData);

        if (!result?.success) {
          alert(result?.error || "Failed to save store");
        } else {
          alert("Store saved successfully");
        }
      } catch (err) {
        console.error(err);
        alert("Unexpected error occurred");
      }
    });
  };

  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newName = e.target.value;
  //   setName(newName);
  //   // Only auto-generate slug if we are creating a NEW store
  //   // Usually, we avoid changing slugs for existing stores to prevent broken URLs
  //   if (!isEdit) {
  //     setSlug(generateSlug(newName));
  //   }
  // };

  // console.log(FormData);
  return (
    <div className=" mx-auto">
      <form
        // action={(formData) =>
        //   startTransition(() => saveStore(store?.id, formData))
        // }
        action={handleSubmit}
        className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5">
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Store" : "Create Store"}
            </h4>
            <p className="text-sm text-gray-500">
              Manage tenant identity and credentials
            </p>
          </div>
          <Link
            href="/platform/stores"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Stores
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="name"
              value={formState.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Blue Mountain Coffee"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store Slug<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-2">
              <input
                name="slug"
                value={formState.slug}
                disabled={isSlugLocked}
                onChange={(e) =>
                  handleChange("slug", generateSlug(e.target.value))
                }
                // value={slug}
                // onChange={(e) => setSlug(generateSlug(e.target.value))}
                className={`w-full px-4 py-2 border rounded-lg transition font-mono text-sm ${
                  isSlugLocked
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                    : "bg-white border-blue-300 ring-2 ring-blue-100 outline-none"
                }`}
                required
              />

              {isEdit && isSlugLocked && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        "Changing the slug will break the store's current URL. Are you sure?",
                      )
                    ) {
                      setIsSlugLocked(false);
                    }
                  }}
                  className=" btn btn-primary"
                >
                  Edit Slug
                </button>
              )}
            </div>

            {!isSlugLocked && isEdit && (
              <p className="mt-2 text-xs text-amber-600 font-medium">
                ⚠️ Warning: Changing this may break existing customer links.
              </p>
            )}
          </div>

          {/* {[
            ["kvkNumber", "KVK Number"],
            ["companyName", "Company Name"],
            ["city", "City"],
            ["country", "Country"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input
                value={formState[key as keyof typeof formState]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          ))} */}

          <InputField
            label="KVK Number"
            name="kvkNumber"
            placeHolder="123456"
          />

          <InputField label="Company Name" name="companyName" />
          <InputField
            label="Chamber of Commerce Number"
            name="chamberOfCommerceNumber"
          />
          <InputField label="Country" name="country" />
          <InputField label="Street" name="street" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="House Number" name="houseNumber" />
            <InputField label="Addition (Optional)" name="addition" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Postal Code" name="postalCode" />
            <InputField label="City" name="city" />
          </div>
          <hr />
          <div className="mt-6 bg-white rounded-lg   ">
            <h2 className="font-semibold text-gray-700 mb-4">
              Business Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                name="firstName"
                placeHolder="First Name"
              />

              <InputField
                label="Middle Name"
                name="middleName"
                placeHolder="Middle Name"
              />
              <InputField
                label="Last Name"
                name="lastName"
                placeHolder="Last Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InputField
                label="Business Phone Number"
                name="businessPhone"
                placeHolder="+31 612345678"
              />
              <InputField
                label="Business Email Address"
                name="businessEmail"
                placeHolder="info@compnat.com"
              />
            </div>

            <div className="mt-4">
              <InputField
                label="VAT Number"
                name="vatNumber"
                placeHolder="NL12345678B01"
              />
            </div>

            {/* <UploadDocument/> */}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              defaultValue={store?.status ?? "active"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white transition"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {!isEdit && (
          <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-4">
              Initial Admin Account
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Name
                </label>
                <input
                  name="adminName"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    name="adminEmail"
                    type="email"
                    placeholder="admin@store.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    name="adminPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          disabled={pending}
          className="w-full py-3 px-4 btn btn-primary disabled:bg-blue-300 text-white font-bold rounded-lg transition-all shadow-sm flex justify-center items-center"
        >
          {pending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : isEdit ? (
            "Update Store"
          ) : (
            "Create Store"
          )}
        </button>
      </form>
    </div>
  );
}
function InputField({
  label,
  name,
  placeHolder,
}: {
  label: string;
  name: string;
  placeHolder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 ">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeHolder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        required
      />
    </div>
  );
}

/* "use client";

import { useTransition } from "react";
import { saveStore } from "@/components/platform/stores/actions";
import Link from "next/link";
import { ArrowLeft } from "react-feather";

export default function StoreForm({ store }: { store?: any }) {
  const [pending, startTransition] = useTransition();

  const isEdit = !!store;

  return (
    <form
      action={(formData) =>
        startTransition(() => saveStore(store?.id, formData))
      }
      className="bg-white p-6 rounded shadow  space-y-4"
    >
      <div className="page-header border-b-2 pb-2">
        <div className="add-item d-flex">
          <div className="page-title">
            <h4>{isEdit ? "Edit Store" : "Create Store"}</h4>
            <h6>Manage Store Details</h6>
          </div>
        </div>
        <ul className="table-top-head">
          <li>
            <div className="page-btn">
              <Link href="/platform/stores" className="btn btn-secondary">
                <ArrowLeft className="me-2" />
                Back to Product
              </Link>
            </div>
          </li>
        </ul>
      </div>
      <div>
        <label className="form-label">
          Name<span className="text-danger ms-1">*</span>
        </label>
        <input
          name="name"
          defaultValue={store?.name}
          placeholder="Store name"
          className="input w-full form-control"
          required
        />
      </div>
      <div>
        <label className="form-label">
          Store-Slug<span className="text-danger ms-1">*</span>
        </label>

        <input
          name="slug"
          defaultValue={store?.slug}
          placeholder="store-slug"
          className="input w-full form-control"
          required
        />
      </div>
      <div>
        <label className="form-label">
          Status<span className="text-danger ms-1">*</span>
        </label>

        <select
          name="status"
          defaultValue={store?.status ?? "active"}
          className="input w-full form-control"
        >
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {!isEdit && (
        <>
          <hr />
          <h3 className="font-semibold text-sm">Store Admin</h3>
          <div>
            <label className="form-label">
              Name<span className="text-danger ms-1">*</span>
            </label>

            <input
              name="adminName"
              placeholder="Admin Name"
              className="input w-full form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Email<span className="text-danger ms-1">*</span>
            </label>

            <input
              name="adminEmail"
              type="email"
              placeholder="Admin Email"
              className="input w-full form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">
              Password<span className="text-danger ms-1">*</span>
            </label>

            <input
              name="adminPassword"
              type="password"
              placeholder="Temporary Password"
              className="input w-full form-control"
              required
            />
          </div>
        </>
      )}

      <button disabled={pending} className="btn btn-primary w-full">
        {pending ? "Saving..." : "Save Store"}
      </button>
    </form>
  );
}
 */
