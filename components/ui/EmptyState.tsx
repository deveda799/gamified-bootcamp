export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-forest/20 bg-white p-6 text-center">
      <p className="font-semibold text-forest">{title}</p>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

