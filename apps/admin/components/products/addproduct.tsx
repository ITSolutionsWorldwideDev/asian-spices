// apps/admin/components/products/addproduct.tsx
"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import { Info, LifeBuoy, Figma, PlusCircle, X } from "react-feather";
import TextEditorNew from "@/core/common/texteditor/texteditor";
import { memo } from "react";

const MemoTextEditor = memo(TextEditorNew);

import Image from "next/image";
import Link from "next/link";

import { all_routes } from "@/data/all_routes";
import { useToast } from "@repo/ui";
import { useRouter } from "next/navigation";

/* ------------------ Types ------------------ */

type Mode = "create" | "edit" | "view";

interface ProductFormProps {
  mode?: Mode;
  productId?: string;
}

type Category = {
  category_id: number;
  category: string;
};

type Subcategory = {
  subcategory_id: number;
  category_id: number;
  title: string;
};

type Brand = {
  brand_id: number;
  name: string;
};

type MediaItem = {
  media_id: number;
  file_name: string;
  file_url: string;
};

type Option = {
  value: number;
  label: string;
};

// ------------------ Utils ------------------

export function getThumb(url: string, size = 300) {
  return `${url}?w=${size}&h=${size}&fit=crop`;
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove symbols
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse hyphens
}

const generateSKU = (name: string, categoryId?: number | null) => {
  if (!name) return "";
  return `SKU-${categoryId ?? "X"}-${name
    .toUpperCase()
    .replace(/\s+/g, "-")
    .slice(0, 10)}-${Date.now().toString().slice(-4)}`;
};

const generateItemCode = (brandId?: number | null) => {
  return `ITEM-${brandId ?? "X"}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ⬆️ OUTSIDE AddProductComponent
const Accordion = memo(function Accordion({
  title,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon?: any;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-md bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2 font-medium text-gray-700">
          {Icon && <Icon size={18} />}
          {title}
        </div>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && <div className="border-t p-4">{children}</div>}
    </div>
  );
});

// ------------------ Component ------------------

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function AddProductComponent({
  mode = "create",
  productId,
}: ProductFormProps) {
  const route = all_routes;
  const router = useRouter();

  const { showToast } = useToast();

  type FormErrors = Partial<Record<keyof typeof formData | "media", string>>;

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    item_code: "",
    category_id: null as number | null,
    subcategory_id: null as number | null,
    brand_id: null as number | null,
    country_of_origin: "",
    description: "",
    price: "",
    quantity: "",
    discount_type_id: null as number | null,
    discount_value: "",
  });

  const [name, setName] = useState(formData.name);
  // const [price, setPrice] = useState(formData.price);
  // const [quantity, setQuantity] = useState(formData.quantity);

  const [selectedMedia, setSelectedMedia] = useState<number[]>([]);
  const [primaryMedia, setPrimaryMedia] = useState<number | null>(null);

  const [slugTouched, setSlugTouched] = useState(false);

  /* ------------------ Fetch Data ------------------ */
  useEffect(() => {
    fetch("/api/category")
      .then((r) => r.json())
      .then((d) => setCategories(d.items || []));

    fetch("/api/subcategory")
      .then((r) => r.json())
      .then((d) => setSubcategories(d.items || []));

    fetch("/api/brand")
      .then((r) => r.json())
      .then((d) => setBrands(d.items || []));

    fetch("/api/media")
      .then((r) => r.json())
      .then((d) => setMedia(d || []));
  }, []);

  const discounttype = [
    { value: 1, label: "Percentage" },
    { value: 2, label: "Cash" },
  ];

  const [accordionOpen, setAccordionOpen] = useState(true);
  const [pricingOpen, setPricingOpen] = useState(true);
  const [imagesOpen, setImagesOpen] = useState(true);

  /* ------------------ Auto Generate ------------------ */
  const debouncedName = useDebounce(formData.name, 400);

  useEffect(() => {
    if (!debouncedName) return;

    setFormData((prev) => ({
      ...prev,
      sku: generateSKU(debouncedName, prev.category_id),
    }));
  }, [debouncedName, formData.category_id]);

  useEffect(() => {
    if (!debouncedName || slugTouched) return;

    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(debouncedName),
    }));
  }, [debouncedName, slugTouched]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      item_code: generateItemCode(prev.brand_id),
    }));
  }, [formData.brand_id]);

  useEffect(() => {
    if (mode === "create") {
      setSlugTouched(false);
    }
  }, [mode]);

  /* ------------------ Select Options ------------------ */
  const categoryOptions: Option[] = categories.map((c) => ({
    value: c.category_id,
    label: c.category,
  }));

  const brandOptions: Option[] = brands.map((b) => ({
    value: b.brand_id,
    label: b.name,
  }));

  const subcategoryOptions: Option[] = subcategories
    .filter((s) => s.category_id === formData.category_id)
    .map((s) => ({
      value: s.subcategory_id,
      label: s.title,
    }));

  const selectedCategory =
    categoryOptions.find((c) => c.value === formData.category_id) || null;

  const selectedSubcategory =
    subcategoryOptions.find((s) => s.value === formData.subcategory_id) || null;

  const selectedBrand =
    brandOptions.find((b) => b.value === formData.brand_id) || null;

  const validateForm = () => {
    const newErrors: FormErrors = {};

    console.log("formData === ", formData);

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.sku) newErrors.sku = "SKU is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";

    if (!formData.subcategory_id)
      newErrors.subcategory_id = "Subcategory is required";

    if (!formData.brand_id) newErrors.brand_id = "Brand is required";
    if (!formData.item_code) newErrors.item_code = "Item code is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";

    if (selectedMedia.length === 0)
      newErrors.media = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------------
  //   Submit
  // ------------------------------------
  const handleSubmit = async () => {
    if (mode !== "view" && !validateForm()) {
      showToast("error", "Please fix validation errors");
      return;
    }

    try {
      setSaving(true);

      const url =
        mode === "edit" ? `/api/products/${productId}` : `/api/products`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Product creation failed");

      const product = await res.json();

      // 2️⃣ Attach images
      // if (selectedMedia.length > 0) {
      await fetch(`/api/products/${product.product_id}/images`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaIds: selectedMedia,
          primaryMediaId: primaryMedia,
        }),
      });
      // }

      showToast(
        "success",
        mode === "edit" ? "Product updated" : "Product created"
      );

      setTimeout(() => {
        router.push("/products");
      }, 3000);

    } catch (err) {
      console.error(err);
      showToast("error", "Action failed");
    } finally {
      setSaving(false);
    }
  };

  const mediaGrid = useMemo(() => {
    return media.map((item) => {
      const isSelected = selectedMedia.includes(item.media_id);
      const isPrimary = primaryMedia === item.media_id;

      return (
        <div
          key={item.media_id}
          onClick={() => {
            setSelectedMedia((prev) =>
              isSelected
                ? prev.filter((id) => id !== item.media_id)
                : [...prev, item.media_id]
            );
            if (!primaryMedia) setPrimaryMedia(item.media_id);
          }}
          className={`relative cursor-pointer rounded border bg-white p-1 transition ${isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"} `}
        >
          <Image
            src={getThumb(item.file_url, 200)}
            alt={item.file_name}
            width={200}
            height={200}
            className="rounded object-cover"
          />

          {/* Primary Badge */}
          {isPrimary && (
            <span className="absolute left-1 top-1 rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
              Primary
            </span>
          )}

          {/* Selection Overlay */}
          {isSelected && (
            <div className="absolute inset-0 rounded bg-blue-500/10" />
          )}
        </div>
      );
    });
  }, [media, selectedMedia, primaryMedia]);

  useEffect(() => {
    if (!productId || mode === "create") return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        setFormData({
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          item_code: data.item_code,
          category_id: data.category_id,
          subcategory_id: data.subcategory_id,
          brand_id: data.brand_id,
          country_of_origin: data.country_of_origin,
          description: data.description,
          price: String(data.price),
          quantity: String(data.quantity),
          discount_type_id: data.discount_type_id,
          discount_value: data.discount_value,
        });

        setSelectedMedia(data.images?.map((i: any) => i.media_id) || []);
        setPrimaryMedia(data.primary_media_id || null);
      } catch {
        showToast("error", "Failed to load product");
      }
    };

    fetchProduct();
  }, [productId, mode]);

  const isView = mode === "view";

  return (
    <div className="page-wrapper p-4 mb-10">
      <div className="content max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h4 className="text-2xl font-semibold">{mode === "edit" ? "Update/View" : "Create"} Product</h4>
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="border rounded shadow-sm">
            <Accordion
              title="Product Information"
              icon={Info}
              open={accordionOpen}
              onToggle={() => setAccordionOpen(!accordionOpen)}
            >
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isView}
                      value={formData.name || ""}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setFormData((prev) => ({ ...prev, name }))}
                      className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isView}
                      value={formData.slug || ""}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setFormData((prev) => ({
                          ...prev,
                          slug: generateSlug(e.target.value),
                        }));
                      }}
                      className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block mb-1 font-medium">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isView}
                      value={formData.sku || ""}
                      readOnly
                      className="w-full border rounded p-2 pr-20 bg-gray-100"
                    />
                    {errors.sku && (
                      <p className="text-red-600 text-sm">{errors.sku}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block mb-1 font-medium">
                      Item Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isView}
                      value={formData.item_code || ""}
                      readOnly
                      className="w-full border rounded p-2 pr-20 bg-gray-100"
                    />
                    {errors.item_code && (
                      <p className="text-red-600 text-sm">{errors.item_code}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium">
                        Category <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Select
                      classNamePrefix="react-select"
                      options={categoryOptions}
                      value={selectedCategory}
                      isDisabled={isView}
                      placeholder="Select Category"
                      onChange={(opt: SingleValue<Option>) =>
                        setFormData({
                          ...formData,
                          category_id: opt?.value ?? null,
                          subcategory_id: null,
                        })
                      }
                    />

                    {errors.category_id && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.category_id}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Sub Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      classNamePrefix="react-select"
                      options={subcategoryOptions}
                      value={selectedSubcategory}
                      placeholder="Select Subcategory"
                      isDisabled={!formData.category_id}
                      onChange={(opt: SingleValue<Option>) =>
                        setFormData({
                          ...formData,
                          subcategory_id: opt?.value ?? null,
                        })
                      }
                    />

                    {errors.subcategory_id && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.subcategory_id}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <Select
                      classNamePrefix="react-select"
                      options={brandOptions}
                      value={selectedBrand}
                      isDisabled={isView}
                      placeholder="Select Brand"
                      onChange={(opt: SingleValue<Option>) =>
                        setFormData({
                          ...formData,
                          brand_id: opt?.value ?? null,
                        })
                      }
                    />
                    {errors.brand_id && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.brand_id}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block mb-1 font-medium">
                      Country of Origin
                    </label>
                    <input
                      type="text"
                      disabled={isView}
                      value={formData.country_of_origin || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          country_of_origin: e.target.value,
                        }))
                      }
                      className="w-full border rounded p-2 pr-20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Description</label>

                  <MemoTextEditor
                    value={formData.description}
                    readOnly={isView}
                    onChange={(val: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: val,
                      }))
                    }
                  />

                  <p className="text-gray-500 text-sm mt-1">Maximum 60 Words</p>
                </div>
              </div>
            </Accordion>

            <Accordion
              title="Pricing & Stocks"
              icon={LifeBuoy}
              open={pricingOpen}
              onToggle={() => setPricingOpen(!pricingOpen)}
            >
              <div className="p-4 border-t space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Quantity <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      disabled={isView}
                      value={formData.quantity || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min={0}
                      step="1"
                    />
                    {errors.quantity && (
                      <p className="text-red-600 text-sm">{errors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      disabled={isView}
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      min={0}
                      step="0.01"
                    />
                    {errors.price && (
                      <p className="text-red-600 text-sm">{errors.price}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Discount Type
                    </label>
                    <Select
                      classNamePrefix="react-select"
                      isDisabled={isView}
                      options={discounttype}
                      value={discounttype.find(
                        (d) => d.value === formData.discount_type_id
                      )}
                      onChange={(opt) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount_type_id: opt?.value ?? null,
                        }))
                      }
                      placeholder="Choose"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      disabled={isView}
                      value={formData.discount_value || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount_value: e.target.value,
                        }))
                      }
                      className="w-full rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      min={0}
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </Accordion>
            <Accordion
              title="Images"
              icon={Figma}
              open={imagesOpen}
              onToggle={() => setImagesOpen(!imagesOpen)}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaGrid}
              </div>

              {selectedMedia.length === 0 && (
                <p className="mt-4 text-sm text-gray-500">
                  Select at least one image for this product.
                </p>
              )}
            </Accordion>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/products" className="btn btn-secondary">
              Cancel
            </Link>
            {mode !== "view" && (
              <button
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                {saving
                  ? "Saving..."
                  : mode === "edit"
                    ? "Update Product"
                    : "Add Product"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
