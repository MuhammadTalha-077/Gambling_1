export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-400/20"
      : variant === "ghost"
      ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
      : "bg-white text-black";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
