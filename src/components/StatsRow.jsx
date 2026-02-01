import Pill from "./ui/Pill";

function StatCard({ label, value, sub, accent = "emerald" }) {
  const accentCls =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "purple"
      ? "text-purple-300"
      : "text-white/80";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] shadow-glow p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-white/60">{label}</div>
        <Pill className="hidden sm:inline-flex">24h</Pill>
      </div>
      <div className={`mt-1 text-lg font-semibold ${accentCls}`}>{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/55">{sub}</div> : null}
    </div>
  );
}

export default function StatsRow({ connected, phase }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        label="Balance"
        value={connected ? "1.284 SOL" : "—"}
        sub={connected ? "Demo balance" : "Connect to show balance"}
        accent="emerald"
      />
      <StatCard label="Players" value="1,208" sub="Active now (demo)" accent="purple" />
      <StatCard
        label="Round Status"
        value={phase === "running" ? "Flying" : phase === "crashed" ? "Crashed" : "Waiting"}
        sub="Auto cycle rounds"
      />
    </div>
  );
}
