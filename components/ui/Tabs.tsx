export function Tabs({ items }: { items: string[] }) {
  return (
    <div className="flex rounded-full bg-white p-1 text-sm">
      {items.map((item, index) => (
        <button
          className={`flex-1 rounded-full px-3 py-2 ${
            index === 0 ? "bg-forest text-white" : "text-muted"
          }`}
          key={item}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

