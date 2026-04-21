"use client";

import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect, useState } from "react";

interface Country {
  id: number;
  name: string;
  code: string;
}

const DEFAULT_COUNTRY = "NL";
const DEFAULT_CURRENCY = "EUR";

export default function UpperSelection() {
  const {
    currencies,
    selectedCurrency,
    rate,
    fetchCurrencies,
    setSelectedCurrency,
  } = useCurrencyStore();

  console.log(currencies);
  console.log("selectedCurrency===  ", selectedCurrency);
  console.log(rate);
  // console.log(fetchCurrencies);

  useEffect(() => {
    fetchCurrencies();
  }, []);
  const [countries, setCountries] = useState<Country[]>([]);
  // const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);

  console.log("setCountries ===  ", setCountries);
  // const [selectedCurrency, setSelectedCurrency] = useState("");
  // const [rate, setRate] = useState(1);
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const [countryRes] = await Promise.all([
        fetch("/api/countries"),
        // fetch("/api/curriencies"),
      ]);

      const countriesData = await countryRes.json();
      // const currenciesData = await currencyRes.json();

      setCountries(countriesData);
      // setCurrencies(currenciesData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (countries.length && !selectedCountry) {
      const nl = countries.find((c) => c.code === "NL");
      if (nl) setSelectedCountry(nl.code);
    }
  }, [countries]);

  return (
    <nav className="flex items-center justify-between px-6 py-3 ">
      {/* LEFT SIDE */}

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4 ">
        {/* COUNTRY SELECT */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border px-3 py-1 rounded-md bg-white"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        {/* CURRENCY SELECT */}
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border px-3 py-1 rounded-md bg-white"
        >
          {currencies.map((c) => (
            <option key={c.id} value={c.code}>
              {c.symbol} - {c.code}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

// console.log(currencies);

// useEffect(() => {
//   if (currencies.length > 0) {
//     const baseCurrency = currencies.find((c) => c.is_base === true);

//     if (baseCurrency) {
//       setSelectedCurrency(baseCurrency.code);
//     }
//   }
// }, [currencies]);

// useEffect(() => {
//   if (!selectedCurrency) return;

//   const fetchRate = async () => {
//     const res = await fetch(`/api/currency-rate?code=${selectedCurrency}`);
//     const data = await res.json();

//     if (data?.rate) {
//       // setRate(data.rate);
//     }
//   };

//   fetchRate();
// }, [selectedCurrency]);

// console.log(rate);

// console.log(selectedCurrency);
