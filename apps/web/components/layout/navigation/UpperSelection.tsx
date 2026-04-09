"use client";

import { useEffect, useState } from "react";

interface Country {
  id: number;
  name: string;
  code: string;
}

interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
}

export default function UpperSelection() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const [countryRes, currencyRes] = await Promise.all([
        fetch("/api/countries"),
        fetch("/api/curriencies"),
      ]);

      const countriesData = await countryRes.json();
      const currenciesData = await currencyRes.json();

      console.log(countriesData);
      console.log(currenciesData);
      setCountries(countriesData);
      setCurrencies(currenciesData);
    };

    fetchData();
  }, []);

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
          <option value="">Select Currency</option>
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
