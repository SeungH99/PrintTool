'use client';

export interface DropzoneLabels {
  dropTitle: string;
  errTitle: string;
  errDesc: string;
  dropOr: string;
  dropBtn: string;
  dropTypes: string;
}

/**
 * Shared file drop area (drag-drop + hidden file input) for the upload tools
 * (ConvertTool, PdfPreflight). The host owns phase/state; this just surfaces a file.
 */
export function Dropzone({
  accept,
  isError,
  onFile,
  labels,
}: {
  accept: string;
  isError: boolean;
  onFile: (file: File) => void;
  labels: DropzoneLabels;
}) {
  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
        isError ? 'border-error bg-[#fdeaea]' : 'border-hairline bg-elevated'
      }`}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      {isError ? (
        <>
          <div className="text-base font-semibold text-ink">{labels.errTitle}</div>
          <div className="text-sm text-body">{labels.errDesc}</div>
        </>
      ) : (
        <div className="text-base font-semibold text-ink">{labels.dropTitle}</div>
      )}
      <div className="text-[13px] text-mute">{labels.dropOr}</div>
      <span className="inline-flex h-9 items-center rounded-pill border border-hairline bg-elevated px-4 text-sm font-medium text-ink">
        {labels.dropBtn}
      </span>
      <span className="font-mono text-[11px] text-faint">{labels.dropTypes}</span>
    </label>
  );
}
