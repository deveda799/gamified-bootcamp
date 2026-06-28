export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className="h-2 rounded-full bg-forest/10">
      <div
        className="h-2 rounded-full bg-action"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

