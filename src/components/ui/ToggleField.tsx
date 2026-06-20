export function ToggleField({
  label,
  checked,
  onChange,
  helper,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helper?: string;
}) {
  return (
    <label className="flex min-w-0 cursor-pointer flex-col gap-1.5">
      <span className="text-[13px] font-medium text-ink">{label}</span>
      <span className="inline-flex h-10 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
          className="h-4 w-4 cursor-pointer accent-[#171717]"
        />
      </span>
      {helper && <span className="text-xs leading-snug text-mute">{helper}</span>}
    </label>
  );
}
