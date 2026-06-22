interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  inline?: boolean;
}

function ToggleButton({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className={`relative inline-flex h-7 w-14 flex-shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-slate-700'}`}
    >
      <span
        className={`mx-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${checked ? 'translate-x-7' : 'translate-x-0'}`}
      />
    </button>
  );
}

export function ToggleSwitch({ label, checked, onChange, description, inline }: ToggleSwitchProps) {
  if (inline) {
    return <ToggleButton checked={checked} onChange={() => onChange(!checked)} />;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-sm shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          {label && <p className="text-base font-semibold text-white">{label}</p>}
          {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
        </div>
        <ToggleButton checked={checked} onChange={() => onChange(!checked)} />
      </div>
    </div>
  );
}
