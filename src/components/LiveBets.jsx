import { useMemo } from "react";
import Card from "./ui/Card";
import Pill from "./ui/Pill";
import { fmt3 } from "../utils/format";

function makeBets() {
  const names = ["Ayaan", "Zara", "Rex", "Nova", "Khan", "Dre", "braz", "Luna"];
  return Array.from({ length: 14 }).map((_, i) => {
    const wager = Math.random() * 0.35 + 0.01;
    const cash = Math.random() * 6 + 1;
    const won = Math.random() > 0.38;
    const profit = won ? wager * (cash - 1) : -wager;
    return {
      id: i,
      user: names[i % names.length],
      wager,
      cash,
      profit,
      status: won ? "won" : "lost",
    };
  });
}

export default function LiveBets() {
  const bets = useMemo(() => makeBets(), []);

  return (
    <Card title="Live Bets" right={<Pill>{bets.length} users</Pill>}>
      <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
        {bets.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{b.user}</div>
              <div className="text-xs text-white/55">{fmt3(b.wager)} SOL</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-white/55">Cashout</div>
              <div className="text-sm font-semibold">{b.cash.toFixed(2)}×</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-white/55">P/L</div>
              <div
                className={
                  b.status === "won"
                    ? "text-sm font-semibold text-emerald-300"
                    : "text-sm font-semibold text-red-300"
                }
              >
                {b.status === "won" ? `+${fmt3(b.profit)}` : fmt3(b.profit)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
