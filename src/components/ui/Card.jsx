export default function Card({ title, right, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] shadow-glow ${className}`}>
      {(title || right) ? (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          {right}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </div>
  );
}
