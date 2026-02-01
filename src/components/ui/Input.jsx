export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/10 ${className}`}
      {...props}
    />
  );
}
