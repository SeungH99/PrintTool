import { cn } from '@/lib/utils/cn';

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  helper,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  helper?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ink">{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.-]/g, ''))}
          disabled={disabled}
          aria-label={label}
          className={cn(
            'h-10 w-full rounded-sm border border-hairline bg-elevated px-3 text-sm text-ink outline-none transition',
            'focus:border-link focus:ring-2 focus:ring-link/20',
            disabled && 'cursor-not-allowed bg-hairline-soft text-faint',
            suffix ? 'pr-11' : 'pr-3',
          )}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 font-mono text-xs text-mute">
            {suffix}
          </span>
        )}
      </div>
      {helper && <span className="text-xs leading-snug text-mute">{helper}</span>}
    </div>
  );
}
