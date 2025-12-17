import { useEffect, useMemo, useState } from "react";
import { TokenSelect } from "./TokenSelect";
import { NumberInput } from "./NumberInput";

type PriceItem = {
  currency: string;
  date: string;
  price: number;
};

type PricesMap = Record<string, number>;

const PRICE_URL = "https://interview.switcheo.com/prices.json";

function normalizePrices(data: PriceItem[]): PricesMap {
  return data.reduce<PricesMap>((acc, item) => {
    acc[item.currency] = item.price;
    return acc;
  }, {});
}

export default function SwapForm() {
  const [prices, setPrices] = useState<PricesMap>({});
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(PRICE_URL)
      .then((res) => res.json())
      .then((data: PriceItem[]) => {
        const normalized = normalizePrices(data);
        const tokens = Object.keys(normalized);

        setPrices(normalized);
        setFromToken(tokens[0]);
        setToToken(tokens[1]);
      })
      .catch(() => setError("Failed to load prices"));
  }, []);

  const rate = useMemo(() => {
    if (!prices[fromToken] || !prices[toToken]) return 0;
    return prices[toToken] / prices[fromToken];
  }, [fromToken, toToken, prices]);

  const outputAmount = useMemo(() => {
    if (!amount || !rate) return "";
    return (Number(amount) * rate).toFixed(6);
  }, [amount, rate]);

  const isInvalid = !amount || Number(amount) <= 0 || fromToken === toToken;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Swap simulated successfully 🚀");
    }, 1200);
  }

  const tokens = Object.keys(prices);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl space-y-5"
    >
      <h2 className="text-2xl font-semibold text-center text-slate-400">
        Swap
      </h2>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      {/* FROM */}
      <div className="rounded-2xl bg-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">You send</span>
          <TokenSelect
            tokens={tokens}
            value={fromToken}
            onChange={setFromToken}
          />
        </div>

        <NumberInput value={amount} onChange={setAmount} />
      </div>

      {/* SWAP BUTTON */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            setFromToken(toToken);
            setToToken(fromToken);
          }}
          className="rounded-full bg-slate-800 p-3 hover:bg-slate-700 cursor-pointer"
        >
          ↕
        </button>
      </div>

      {/* TO */}
      <div className="rounded-2xl bg-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">You receive</span>
          <TokenSelect tokens={tokens} value={toToken} onChange={setToToken} />
        </div>

        <input
          value={outputAmount}
          disabled
          className="w-full bg-transparent text-3xl font-semibold opacity-60"
        />
      </div>

      {fromToken === toToken && (
        <p className="text-xs text-red-400 text-center">
          Please select different tokens
        </p>
      )}

      <button
        disabled={isInvalid || loading}
        className="cursor-pointer w-full rounded-xl bg-sky-500 py-4 font-semibold text-slate-900 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Confirm Swap"}
      </button>
    </form>
  );
}
