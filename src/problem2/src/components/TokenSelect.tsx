import { useEffect, useMemo, useRef, useState } from "react";

type TokenSelectProps = {
  tokens: string[];
  value: string;
  onChange: (token: string) => void;
};

const tokenIcon = (symbol: string) =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;

export function TokenSelect({ tokens, value, onChange }: TokenSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => t.toLowerCase().includes(search.toLowerCase()));
  }, [tokens, search]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          flex items-center gap-2 rounded-xl bg-slate-800
          px-4 py-3 hover:bg-slate-700 cursor-pointer
        "
      >
        <img src={tokenIcon(value)} alt={value} className="h-6 w-6" />
        <span className="font-medium">{value}</span>
        <span className="ml-1 text-slate-400">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 z-20 mt-2 w-64
            rounded-xl bg-slate-900 shadow-2xl
          "
        >
          {/* Search */}
          <div className="p-3 border-b border-slate-800">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search token..."
              className="
                w-full rounded-lg bg-slate-800 px-3 py-2
                text-sm outline-none placeholder:text-slate-500
              "
            />
          </div>

          {/* Token list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredTokens.length === 0 && (
              <p className="p-4 text-sm text-slate-500 text-center">
                No tokens found
              </p>
            )}

            {filteredTokens.map((token) => {
              return (
                <button
                  key={token}
                  type="button"
                  onClick={() => {
                    onChange(token);
                    setOpen(false);
                  }}
                  className="
                  flex w-full items-center gap-3 px-4 py-3
                  text-slate-400 hover:bg-sky-500
                  hover:text-slate-900 cursor-pointer
                "
                >
                  <img src={tokenIcon(token)} alt={token} className="h-6 w-6" />
                  <span>{token}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
