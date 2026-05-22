export default function PaperLoading() {
  return (
    <div className="max-w-[800px] mx-auto">
      <div className="bg-white shadow-lg rounded-[var(--radius-lg)] p-12">
        <div className="h-8 w-64 mx-auto skeleton mb-4" />
        <div className="h-4 w-48 mx-auto skeleton mb-8" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 w-32 skeleton" />
              <div className="h-3 w-full skeleton" />
              <div className="h-3 w-5/6 skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
