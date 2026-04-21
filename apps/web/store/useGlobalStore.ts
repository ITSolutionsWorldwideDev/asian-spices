// apps/web/store/useGlobalStore.ts

import { create } from "zustand";

interface Country {
  id: number;
  name: string;
  iso2: string;
}

interface Currency {
  id: number;
  code: string;
  symbol: string;
}

interface GlobalState {
  countries: Country[];
  currencies: Currency[];
  selectedCountry: string;
  selectedCurrency: string;

  fetchInitialData: () => Promise<void>;
  setSelectedCountry: (code: string) => void;
  setSelectedCurrency: (code: string) => void;
}

const DEFAULT_COUNTRY = "NL";
const DEFAULT_CURRENCY = "EUR";

export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  currencies: [],
  selectedCountry: "",
  selectedCurrency: "",

  fetchInitialData: async () => {
    const { countries, currencies } = get();

    // ✅ prevent refetch
    if (countries.length > 0 && currencies.length > 0) return;

    const [countryRes, currencyRes] = await Promise.all([
      fetch("/api/countries"),
      fetch("/api/currencies"),
    ]);

    // ✅ check response BEFORE parsing
    if (!countryRes.ok) throw new Error("Countries fetch failed");
    if (!currencyRes.ok) throw new Error("Currencies fetch failed");

    const countriesData = await countryRes.json();
    const currenciesData = await currencyRes.json();

    set({
      countries: countriesData,
      currencies: currenciesData,
      selectedCountry: DEFAULT_COUNTRY,
      selectedCurrency: DEFAULT_CURRENCY,
    });
  },

  setSelectedCountry: (code) => set({ selectedCountry: code }),
  setSelectedCurrency: (code) => set({ selectedCurrency: code }),
}));