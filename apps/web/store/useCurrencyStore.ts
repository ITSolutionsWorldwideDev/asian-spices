import { create } from "zustand";

interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  is_base: boolean;
  //   symbol:
}

interface CurrencyStore {
  currencies: Currency[];
  selectedCurrency: string;
  rate: number;
  symbol: string;

  // actions
  fetchCurrencies: () => Promise<void>;
  setSelectedCurrency: (code: string) => Promise<void>;
  fetchRate: (code: string) => Promise<void>;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  currencies: [],
  selectedCurrency: "",
  rate: 1,
  symbol: "",

  // 🔹 Fetch currencies only
  fetchCurrencies: async () => {
    try {
      const res = await fetch("/api/curriencies"); // ✅ fix spelling here
      const currencies = await res.json();

      const baseCurrency = currencies.find((c: Currency) => c.is_base);

      set({
        currencies,
        selectedCurrency: baseCurrency ? baseCurrency.code : "",
      });

      // fetch rate for base currency
      if (baseCurrency) {
        await get().fetchRate(baseCurrency.code);
      }
    } catch (err) {
      console.error("Error fetching currencies", err);
    }
  },

  // 🔹 Set currency + fetch rate
  setSelectedCurrency: async (code) => {
    set({ selectedCurrency: code });
    await get().fetchRate(code);
  },

  // 🔹 Fetch exchange rate
  fetchRate: async (code) => {
    try {
      const res = await fetch(`/api/currency-rate?code=${code}`);
      const data = await res.json();
      console.log("data from rate api", data);
      if (data?.rate) {
        set({ rate: data.rate, symbol: data.symbol });
      }
    } catch (err) {
      console.error("Error fetching rate", err);
    }
  },
}));
