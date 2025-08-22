'use client';

interface ButtonGroupProps<T extends string> {
  label: string;
  options: T[];
  value: T;
  onChange: (val: T) => void;
  icons?: Partial<Record<T | string, string>>; // optional emojis/icons by value key
}

export default function ButtonGroup<T extends string>({ label, options, value, onChange, icons }: ButtonGroupProps<T>) {
  return (
    <div>
      <p className="font-semibold mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`px-4 py-2 border rounded-lg transition ${value === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50'}`}
            onClick={() => onChange(opt)}
            aria-pressed={value === opt}
          >
            <span className="mr-1">{icons?.[opt] ?? ''}</span>{opt}
          </button>
        ))}
      </div>
    </div>
  );
}
