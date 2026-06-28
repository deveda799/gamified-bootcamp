export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card bg-white p-4 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-forest">{value}</p>
    </div>
  );
}

