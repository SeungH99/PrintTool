export interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-10 w-full appearance-none rounded-sm border border-hairline bg-elevated pl-3 pr-9 text-sm text-ink outline-none transition focus:border-link focus:ring-2 focus:ring-link/20"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-mute">
          ▾
        </span>
      </div>
    </div>
  );
}
