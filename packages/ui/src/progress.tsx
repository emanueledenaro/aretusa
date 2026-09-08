

export function Progress({ value, label }: { value: number; label: string }) {
  const current = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span>{current}%</span>
      </div>
      <progress
        aria-label={label}
        value={current}
        max={100}
        className="h-2 w-full overflow-hidden rounded-full accent-terracotta"
      />
    </div>
  );
}
