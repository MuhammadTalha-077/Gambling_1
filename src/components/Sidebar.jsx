import Pill from "./ui/Pill";

const games = [
  { name: "Crash", active: true },
  { name: "Coinflip", active: false },
  { name: "Blackjack", active: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-[280px] p-4 border-r border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight">
          GAMBLE<span className="text-emerald-400">HUB</span>
        </h1>
        <Pill className="text-emerald-300/80 border-emerald-400/20 bg-emerald-400/10">
          Live
        </Pill>
      </div>

      <div className="mt-5 space-y-2">
        {games.map((g) => (
          <button
            key={g.name}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition border
              ${g.active
                ? "bg-emerald-400/10 border-emerald-400/25 text-white"
                : "bg-white/5 border-white/10 text-white/85 hover:bg-white/10"
              }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4">
        <div className="text-xs text-white/60">Rewards</div>
        <div className="mt-1 text-sm font-semibold">Hourly Airdrop</div>
        <p className="mt-2 text-xs text-white/55 leading-relaxed">
          Polished demo UI. Connect your backend to enable claims & balances.
        </p>
        <button className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
          Open Rewards
        </button>
      </div>

      <div className="mt-5 text-xs text-white/35 leading-relaxed">
        Tip: Keep a small SOL buffer for fees.
      </div>
    </aside>
  );
}
