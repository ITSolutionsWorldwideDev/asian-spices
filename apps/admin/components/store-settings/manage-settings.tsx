// apps/admin/components/store-settings/manage-settings.tsx

"use client";

import { useEffect, useMemo, useState, memo } from "react";
import Select, { SingleValue } from "react-select";
import {
  Info,
  Image as ImageIcon,
  Globe,
  CreditCard,
  Truck,
  Percent,
  Search,
  FileText,
  Clock,
} from "react-feather";
import TextEditorNew from "@/core/common/texteditor/texteditor";

const MemoTextEditor = memo(TextEditorNew);

import Image from "next/image";
import Link from "next/link";

import { all_routes } from "@/data/all_routes";
import { useToast } from "@repo/ui";
import { useRouter } from "next/navigation";

// type Mode = "create" | "edit" | "view";

type AccordionProps = {
  title: string;
  icon?: any;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

type Countries = {
  id: number;
  name: string;
  iso2: string;
};

type Option = {
  value: number;
  label: string;
};

type Currency = {
  id: string;
  code: string;
  name: string;
  symbol: string;
};

function Accordion({
  title,
  icon: Icon,
  open,
  onToggle,
  children,
}: AccordionProps) {
  return (
    <div className="border rounded-md bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 font-medium text-gray-700"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={18} />}
          {title}
        </div>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && <div className="border-t p-6 space-y-6">{children}</div>}
    </div>
  );
}

// ------------------ Component ------------------

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function ManageSettingsComponent() {
  const router = useRouter();

  const { showToast } = useToast();

  type FormErrors = Partial<Record<keyof typeof formData | "media", string>>;

  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<Countries[]>([]);

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selected, setSelected] = useState<string>("");

  const [slugTouched, setSlugTouched] = useState(false);
  const [workingHours, setWorkingHours] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/store-settings");
        if (!res.ok) throw new Error();

        const data = await res.json();

        // setWorkingHours(data.working_hours || []);
        if (!data.working_hours || data.working_hours.length === 0) {
          const defaultHours = Array.from({ length: 7 }).map((_, i) => ({
            day_of_week: i,
            open_time: "09:00",
            close_time: "18:00",
            is_closed: false,
          }));

          setWorkingHours(defaultHours);
        }

        const sanitizedData = Object.keys(data).reduce((acc, key) => {
          acc[key] = data[key] === null ? "" : data[key];
          return acc;
        }, {} as any);

        setFormData((prev) => ({
          ...prev,
          ...sanitizedData,
          renewal_date: data.renewal_date
            ? data.renewal_date.split("T")[0]
            : "",
        }));

        if (data.currency_id) {
          if (!data.currency_id || currencies.length === 0) return;

          const found = currencies.find((c) => c.id === data.currency_id);

          if (found) {
            setFormData((prev) => ({
              ...prev,
              currency_id: found.id,
              currency_code: found.code,
              currency_symbol: found.symbol,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const [formData, setFormData] = useState({
    /* GENERAL */
    store_name: "",
    store_email: "",
    store_phone: "",

    /* SETTINGS */
    currency_id: "",
    currency_code: "",
    currency_symbol: "",
    country_code: "",
    timezone: "",
    language: "en",
    date_format: "YYYY-MM-DD",
    time_format: "24h",

    /* BRANDING */
    logo_url: "",
    favicon_url: "",
    banner_url: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
    theme_mode: "light",

    /* TAX */
    tax_name: "",
    tax_rate: 0,
    tax_inclusive: false,
    tax_registration_number: "",

    /* PAYMENT */
    stripe_enabled: false,
    stripe_account_id: "",
    razorpay_enabled: false,
    cod_enabled: false,

    /* SHIPPING */
    free_shipping_threshold: 0,
    flat_shipping_rate: 0,
    international_shipping: false,

    /* SEO */
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    facebook_pixel_id: "",
    google_analytics_id: "",

    /* BILLING */
    plan_name: "",
    status: "",
    renewal_date: "",
  });

  /* ------------------ Auto Generate ------------------ */
  const debouncedName = useDebounce(formData.store_name, 400);

  /* ------------------ Fetch Data ------------------ */
  useEffect(() => {
    fetch("/api/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    fetch("/api/currencies")
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(Array.isArray(data) ? data : data.items || []);
      });
  }, []);

  /* ------------------ Select Options ------------------ */

  // Inside ManageSettingsComponent

  const currencyOptions = useMemo(() => {
    if (!Array.isArray(currencies)) return [];

    return currencies.map((c) => ({
      value: c.id,
      label: `${c.code} (${c.symbol})`,
      code: c.code,
      symbol: c.symbol,
    }));
  }, [currencies]);

  const selectedCurrency = useMemo(
    () => currencyOptions.find((c) => c.value === formData.currency_id) || null,
    [currencyOptions, formData.currency_id],
  );

  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.iso2, label: c.name })),
    [countries],
  );

  const selectedCountry = useMemo(
    () => countryOptions.find((c) => c.value === formData.country_code) || null,
    [countryOptions, formData.country_code],
  );

  const [open, setOpen] = useState({
    general: true,
    branding: false,
    localization: false,
    payments: false,
    shipping: false,
    tax: false,
    seo: false,
    billing: false,
    workingHours: false,
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ------------------------------------
  //   Submit
  // ------------------------------------

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setLoading(true);

      const res = await fetch("/api/store-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(formData),
        body: JSON.stringify({
          ...formData,
          working_hours: workingHours,
        }),
      });

      if (!res.ok) throw new Error();

      showToast("success", "Settings updated successfully");
      router.refresh();
    } catch {
      showToast("error", "Failed to update settings");
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper p-4 mb-10">
      <div className="content max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h4 className="text-2xl font-semibold">Manage Settings</h4>
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
              title="General Information"
              icon={Info}
              open={open.general}
              onToggle={() => setOpen({ ...open, general: !open.general })}
            >
              <div className="p-4 border-t space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Store Name"
                    value={formData.store_name}
                    onChange={(v) => handleChange("store_name", v)}
                  />
                  <Input
                    label="Email"
                    value={formData.store_email}
                    onChange={(v) => handleChange("store_email", v)}
                  />
                  <Input
                    label="Phone"
                    value={formData.store_phone}
                    onChange={(v) => handleChange("store_phone", v)}
                  />
                </div>
              </div>
            </Accordion>

            <Accordion
              title="Branding Information"
              icon={ImageIcon}
              open={open.branding}
              onToggle={() => setOpen({ ...open, branding: !open.branding })}
            >
              <div className="p-4 border-t space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Logo URL"
                    value={formData.logo_url}
                    onChange={(v) => handleChange("logo_url", v)}
                  />
                  <Input
                    label="Favicon URL"
                    value={formData.favicon_url}
                    onChange={(v) => handleChange("favicon_url", v)}
                  />
                  <ColorInput
                    label="Primary Color"
                    value={formData.primary_color}
                    onChange={(v) => handleChange("primary_color", v)}
                  />
                  <ColorInput
                    label="Secondary Color"
                    value={formData.secondary_color}
                    onChange={(v) => handleChange("secondary_color", v)}
                  />
                </div>
              </div>
            </Accordion>

            <Accordion
              title="Localization Information"
              icon={Globe}
              open={open.localization}
              onToggle={() =>
                setOpen({ ...open, localization: !open.localization })
              }
            >
              <div className="p-4 border-t space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block mb-1 font-medium">Country</label>

                    <Select
                      options={countryOptions}
                      value={selectedCountry}
                      onChange={(opt) =>
                        handleChange("country_code", opt?.value ?? "")
                      }
                    />
                  </div>

                  <Input
                    label="Timezone"
                    value={formData.timezone}
                    onChange={(v) => handleChange("timezone", v)}
                  />

                  <div>
                    <label className="block mb-1 font-medium">Currency</label>

                    <Select
                      options={currencyOptions}
                      value={selectedCurrency}
                      onChange={(opt: any) => {
                        handleChange("currency_id", opt?.value || "");
                        handleChange("currency_code", opt?.code || "");
                        handleChange("currency_symbol", opt?.symbol || "");
                      }}
                    />
                  </div>
                  {/* <Input
                    label="Currency Code"
                    value={formData.currency_code}
                    onChange={(v) => handleChange("currency_code", v)}
                  /> */}
                  <Input
                    label="Language"
                    value={formData.language}
                    onChange={(v) => handleChange("language", v)}
                  />
                </div>
              </div>
            </Accordion>

            <Accordion
              title="Payments Information"
              icon={CreditCard}
              open={open.payments}
              onToggle={() => setOpen({ ...open, payments: !open.payments })}
            >
              <div className="p-4 border-t space-y-4">
                <Toggle
                  label="Enable Stripe"
                  checked={formData.stripe_enabled}
                  onChange={(v) => handleChange("stripe_enabled", v)}
                />
                <Input
                  label="Stripe Account ID"
                  value={formData.stripe_account_id}
                  onChange={(v) => handleChange("stripe_account_id", v)}
                />
                <Toggle
                  label="Enable Cash on Delivery"
                  checked={formData.cod_enabled}
                  onChange={(v) => handleChange("cod_enabled", v)}
                />
              </div>
            </Accordion>

            <Accordion
              title="Shipping Information"
              icon={Truck}
              open={open.shipping}
              onToggle={() => setOpen({ ...open, shipping: !open.shipping })}
            >
              <div className="p-4 border-t space-y-4">
                <Input
                  label="Free Shipping Threshold"
                  type="number"
                  value={formData.free_shipping_threshold}
                  onChange={(v) =>
                    handleChange("free_shipping_threshold", Number(v))
                  }
                />

                <Input
                  label="Flat Shipping Rate"
                  type="number"
                  value={formData.flat_shipping_rate}
                  onChange={(v) =>
                    handleChange("flat_shipping_rate", Number(v))
                  }
                />

                <Toggle
                  label="Enable International Shipping"
                  checked={formData.international_shipping}
                  onChange={(v) => handleChange("international_shipping", v)}
                />
              </div>
            </Accordion>

            <Accordion
              title="Tax Information"
              icon={Percent}
              open={open.tax}
              onToggle={() => setOpen({ ...open, tax: !open.tax })}
            >
              <div className="p-4 border-t space-y-4">
                <Input
                  label="Tax Name (VAT/GST)"
                  value={formData.tax_name}
                  onChange={(v) => handleChange("tax_name", v)}
                />

                <Input
                  label="Tax Rate (%)"
                  type="number"
                  value={formData.tax_rate}
                  onChange={(v) => handleChange("tax_rate", Number(v))}
                />

                <Toggle
                  label="Tax Inclusive"
                  checked={formData.tax_inclusive}
                  onChange={(v) => handleChange("tax_inclusive", v)}
                />

                <Input
                  label="Tax Registration Number"
                  value={formData.tax_registration_number}
                  onChange={(v) => handleChange("tax_registration_number", v)}
                />
              </div>
            </Accordion>

            <Accordion
              title="SEO Information"
              icon={Search}
              open={open.seo}
              onToggle={() => setOpen({ ...open, seo: !open.seo })}
            >
              <div className="p-4 border-t space-y-4">
                <Input
                  label="Meta Title"
                  value={formData.meta_title}
                  onChange={(v) => handleChange("meta_title", v)}
                />
                <Textarea
                  label="Meta Description"
                  value={formData.meta_description}
                  onChange={(v) => handleChange("meta_description", v)}
                />
                <Textarea
                  label="Meta Keywords"
                  value={formData.meta_keywords}
                  onChange={(v) => handleChange("meta_keywords", v)}
                />
              </div>
            </Accordion>

            <Accordion
              title="Billing & Plan"
              icon={Search}
              open={open.billing}
              onToggle={() => setOpen({ ...open, billing: !open.billing })}
            >
              <div className="p-4 border-t space-y-4">
                <Input
                  label="Plan Name"
                  value={formData.plan_name}
                  onChange={(v) => handleChange("plan_name", v)}
                />

                <Input
                  label="Subscription Status"
                  value={formData.status}
                  onChange={(v) => handleChange("status", v)}
                />

                <Input
                  label="Renewal Date"
                  type="date"
                  value={formData.renewal_date}
                  onChange={(v) => handleChange("renewal_date", v)}
                />
              </div>
            </Accordion>

            <Accordion
              title="Working Hours"
              icon={Clock}
              open={open.workingHours}
              onToggle={() =>
                setOpen({ ...open, workingHours: !open.workingHours })
              }
            >
              <div className="p-4 border-t space-y-4">
                {workingHours.map((day, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-3 items-center border-b pb-2"
                  >
                    {/* DAY */}
                    <div className="font-medium">
                      {
                        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                          day.day_of_week
                        ]
                      }
                    </div>

                    {/* CLOSED TOGGLE */}
                    <Toggle
                      label="Closed"
                      checked={day.is_closed}
                      onChange={(v) => {
                        const updated = [...workingHours];
                        updated[index].is_closed = v;
                        setWorkingHours(updated);
                      }}
                    />

                    {/* OPEN TIME */}
                    <input
                      type="time"
                      disabled={day.is_closed}
                      value={day.open_time || ""}
                      onChange={(e) => {
                        const updated = [...workingHours];
                        updated[index].open_time = e.target.value;
                        setWorkingHours(updated);
                      }}
                      className="border px-2 py-1 rounded"
                    />

                    {/* CLOSE TIME */}
                    <input
                      type="time"
                      disabled={day.is_closed}
                      value={day.close_time || ""}
                      onChange={(e) => {
                        const updated = [...workingHours];
                        updated[index].close_time = e.target.value;
                        setWorkingHours(updated);
                      }}
                      className="border px-2 py-1 rounded"
                    />

                    {/* STATUS */}
                    <span className="text-xs text-gray-500">
                      {day.is_closed ? "Closed" : "Open"}
                    </span>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>

          <div className="flex justify-end gap-3 my-4">
            <button
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Inputs ---------- */

type InputProps = {
  label: string;
  value: string | number | "";
  type?: string;
  onChange: (value: string) => void;
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}

type TextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Textarea({ label, value, onChange }: TextareaProps) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        className="w-full border rounded px-3 py-2"
        rows={3}
      />
    </div>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <div className="form-check form-check-md d-flex align-items-center me-3">
      <input
        className="form-check-input"
        type="checkbox"
        defaultValue=""
        id="checkebox-md"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.checked)
        }
      />
      <label className="form-check-label" htmlFor="checkebox-md">
        {label}
      </label>
    </div>
  );
}

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="w-full h-10"
      />
    </div>
  );
}
