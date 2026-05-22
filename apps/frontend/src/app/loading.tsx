export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-40 skeleton mb-2" />
          <div className="h-4 w-64 skeleton" />
        </div>
        <div className="h-9 w-24 skeleton rounded-[var(--radius-md)]" />
      </div>
      <div className="grid gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 skeleton rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
