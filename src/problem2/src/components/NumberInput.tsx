type NumberInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function NumberInput({
  value,
  onChange,
  placeholder = "0.0",
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    const num = Number(val);
    if (isNaN(num) || num < 0 || typeof num !== "number") return;

    onChange(val);
  };

  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="
        w-full bg-transparent text-3xl font-semibold
        outline-none placeholder:text-slate-600
      "
    />
  );
}
