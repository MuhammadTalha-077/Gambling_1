import { useMemo, useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Pill from "./ui/Pill";
import { fmt3 } from "../utils/format";

export default function BetPanel({ connected, phase, multiplier }) {
  const [amount, setAmount] = useState("0.05");
  const [autoCashout, setAutoCashout] = useState("2.00");
  const [mode, setMode] = useState("auto"); // auto | manual
  const [placing, setPlacing] = useState(false);

  const amountNum = Number(amount) || 0;
  const cashNum = Number(autoCashout) || 0;

  const potential = useMemo(() => {
    if (!amountNum || !cashNum) return 0;
    return amountNum * cashNum;
  }, [amountNum, cashNum]);

  const canBet = connected && phase !== "crashed" && !placing;

  function quickAmount(v) {
    setAmount(v);
  }
  function quickCashout(v) {
    setAutoCashout(v);
  }

  async function onPlaceBet() {
    if (!canBet) return;
    setPlacing(true);
    // demo delay
    await new Promise((r) => setTimeout(r, 550));
    setPlacing(false);
    // In real app: call backend here
  }

  return (
    <Card
      title="Place Bet"
      right={
        <button
          onClick={() => setMode((m) => (m === "auto" ? "manual" : "auto"))}
          className="text-xs font-semibold text-white/70 hover:text-white"
          type="button"
        >
          {mode === "auto" ? "Auto" : "Manual"}
        </button>
      }
    >
      {!connected ? (
        <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
          Connect your wallet to enable betting (demo).
        </div>
      ) : null}

      <div className="space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs text-white/60">Amount (SOL)</div>
            <div className="flex gap-1">
              {["0.01", "0.05", "0.10"].map((v) => (
                <button
                  key={v}
                  onClick={() => quickAmount(v)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  type="button"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.05" inputMode="decimal" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs text-white/60">Auto Cashout</div>
            <div className="flex flex-wrap gap-1">
              {["1.5", "2", "3", "5"].map((v) => (
                <button
                  key={v}
                  onClick={() => quickCashout(v)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  type="button"
                  disabled={mode !== "auto"}
                >
                  {v}×
                </button>
              ))}
            </div>
          </div>
          <Input
            value={autoCashout}
            onChange={(e) => setAutoCashout(e.target.value)}
            placeholder="2.00"
            disabled={mode !== "auto"}
            inputMode="decimal"
          />
          {mode !== "auto" ? (
            <div className="mt-2 text-xs text-white/45">
              Manual mode: you cash out yourself (demo).
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Potential payout</span>
            <span className="font-semibold text-white">
              {fmt3(potential)} SOL
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-white/60">Current multiplier</span>
            <span className="font-semibold">
              {multiplier.toFixed(2)}×
            </span>
          </div>
        </div>

        <Button
          className="w-full py-3 text-base font-extrabold"
          onClick={onPlaceBet}
          disabled={!canBet}
        >
          {placing ? "Placing…" : connected ? "Place Bet" : "Connect to Bet"}
        </Button>

        <div className="flex flex-wrap gap-2">
          <Pill>Fast</Pill>
          <Pill>Low fees</Pill>
          <Pill className="text-emerald-300/80 border-emerald-400/20 bg-emerald-400/10">
            UX polished
          </Pill>
        </div>
      </div>
    </Card>
  );
}
