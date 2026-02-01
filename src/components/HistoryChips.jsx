export default function HistoryChips({ history = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {history.slice(0, 10).map((m, idx) => {
        const isLow = m < 2;
        return (
          <span
            key={`${m}-${idx}`}
            className={`rounded-full border px-3 py-1 text-xs font-semibold
              ${isLow ? "border-red-400/20 bg-red-400/10 text-red-200" : "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"}`}
          >
            {m.toFixed(2)}x
          </span>
        );
      })}
    </div>
  );
}
