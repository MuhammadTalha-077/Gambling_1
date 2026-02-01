import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StatsRow from "../components/StatsRow";
import CrashStage from "../components/CrashStage";
import BetPanel from "../components/BetPanel";
import LiveBets from "../components/LiveBets";
import HistoryChips from "../components/HistoryChips";
import ChatSidebar from "../components/ChatSidebar";
import { useCrashEngine } from "../hooks/useCrashEngine";

export default function Crash() {
  const [connected, setConnected] = useState(false);

  const { phase, multiplier, lastCrash, countdownMs, nonce, history } =
    useCrashEngine({
      roundDelayMs: 4500,
      crashFreezeMs: 2200,
      seed: "demo",
    });

  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[95px]" />
        <div className="absolute -bottom-24 left-12 h-[460px] w-[460px] rounded-full bg-emerald-400/10 blur-[95px]" />
        <div className="absolute right-12 top-40 h-[380px] w-[380px] rounded-full bg-fuchsia-400/10 blur-[95px]" />
      </div>

      <div className="relative mx-auto flex max-w-[1600px] gap-4 p-4 lg:p-6">
        <Sidebar />

        <main className="flex-1 space-y-4">
          <TopBar
            connected={connected}
            onToggleConnect={() => setConnected((v) => !v)}
          />

          <StatsRow connected={connected} phase={phase} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-white/50">Recent multipliers</div>
            <HistoryChips history={history} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
            <CrashStage
              phase={phase}
              multiplier={multiplier}
              lastCrash={lastCrash}
              countdownMs={countdownMs}
              nonce={nonce}
            />

            <div className="space-y-4">
              <BetPanel
                connected={connected}
                phase={phase}
                multiplier={multiplier}
              />
              <LiveBets />
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.03] p-4 text-xs text-white/55 shadow-glow">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="font-semibold text-white/80">Demo Note:</span>{" "}
                Chat is demo UI. Hook to backend for moderation, rooms, and persistence.
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Help</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Fairness</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">FAQ</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">TOS</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right chat sidebar (solpump-style) */}
        <div className="hidden lg:block">
          <ChatSidebar />
        </div>
      </div>

      {/* Mobile chat overlay (inside component) */}
      <div className="lg:hidden">
        <ChatSidebar />
      </div>
    </div>
  );
}
