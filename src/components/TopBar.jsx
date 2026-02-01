import Button from "./ui/Button";
import Pill from "./ui/Pill";

export default function TopBar({ connected, onToggleConnect }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight">Crash</h2>
          <Pill>Provably fair*</Pill>
          <Pill>Instant settlement</Pill>
        </div>
        <p className="mt-1 text-sm text-white/55">
          Cash out before it crashes. (Demo UI — wire backend later)
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hidden sm:inline-flex">
          Stats
        </Button>
        <Button onClick={onToggleConnect} className="min-w-[170px]">
          {connected ? "Connected" : "Connect Wallet"}
        </Button>
      </div>
    </div>
  );
}
