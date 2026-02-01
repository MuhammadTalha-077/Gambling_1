import { useEffect, useMemo, useRef } from "react";
import Card from "./ui/Card";
import Pill from "./ui/Pill";
import { fmt2, clamp } from "../utils/format";

function useDevicePixelRatio() {
  return typeof window !== "undefined" ? Math.max(1, window.devicePixelRatio || 1) : 1;
}

export default function CrashStage({ phase, multiplier, lastCrash, countdownMs, nonce }) {
  const canvasRef = useRef(null);
  const dpr = useDevicePixelRatio();

  const status = useMemo(() => {
    if (phase === "running") return { label: "LIVE", cls: "text-emerald-300 border-emerald-400/25 bg-emerald-400/10" };
    if (phase === "crashed") return { label: "CRASHED", cls: "text-red-300 border-red-400/25 bg-red-400/10" };
    return { label: "WAITING", cls: "text-white/70 border-white/10 bg-white/5" };
  }, [phase]);

  const displayMul = phase === "crashed" ? lastCrash : multiplier;

  // Draw a smooth curve approximating growth
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // background grid
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;

    const grid = 44;
    for (let x = 0; x <= w; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }

    // axes padding
    const pad = 28;
    const x0 = pad;
    const y0 = h - pad;
    const x1 = w - pad;
    const y1 = pad;

    // curve domain
    const maxX = 12; // seconds scale
    const maxMul = clamp(displayMul * (phase === "running" ? 1.2 : 1.1), 2, 60);

    // curve function
    function curve(t) {
      // same as engine-ish: 1 + (exp(k t) - 1)
      const k = 0.58;
      return 1 + (Math.exp(k * t) - 1);
    }

    const currentT = phase === "running" ? Math.min(maxX, Math.log(displayMul) / 0.58) : Math.min(maxX, Math.log(displayMul) / 0.58);
    const steps = 120;
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (currentT * i) / steps;
      const m = Math.min(curve(t), maxMul);
      const x = x0 + (t / maxX) * (x1 - x0);
      const y = y0 - ((m - 1) / (maxMul - 1)) * (y0 - y1);
      pts.push([x, y]);
    }

    // glow underlay
    ctx.save();
    ctx.strokeStyle = phase === "crashed" ? "rgba(248,113,113,0.45)" : "rgba(52,211,153,0.45)";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
    ctx.restore();

    // main line
    ctx.save();
    ctx.strokeStyle = phase === "crashed" ? "rgba(248,113,113,0.95)" : "rgba(52,211,153,0.95)";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
    ctx.restore();

    // dot
    const [dx, dy] = pts[pts.length - 1];
    ctx.beginPath();
    ctx.fillStyle = phase === "crashed" ? "rgba(248,113,113,1)" : "rgba(52,211,153,1)";
    ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // y labels (few)
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    const labels = [1, Math.min(2, maxMul), Math.min(5, maxMul), Math.min(10, maxMul)].filter((v, i, arr) => arr.indexOf(v) === i);
    labels.forEach((v) => {
      const y = y0 - ((v - 1) / (maxMul - 1)) * (y0 - y1);
      ctx.fillText(`${v}x`, 10, y + 4);
    });

  }, [phase, multiplier, lastCrash, countdownMs, nonce, dpr]);

  const titleRight = (
    <div className="flex items-center gap-2">
      <Pill className={status.cls}>{status.label}</Pill>
      <Pill>Nonce: {nonce}</Pill>
    </div>
  );

  return (
    <Card title="Crash Stage" right={titleRight} className="overflow-hidden">
      <div className="relative">
        <div className="relative h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
          {/* glow blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-16 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-purple-500/18 blur-[90px]" />
            <div className="absolute -bottom-24 left-10 h-[320px] w-[320px] rounded-full bg-emerald-400/10 blur-[90px]" />
          </div>

          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Center HUD */}
          <div className="relative flex h-full items-center justify-center">
            <div className={`text-center ${phase === "crashed" ? "animate-shake" : ""}`}>
              <div className="text-[64px] leading-none sm:text-[76px] font-black tracking-tight">
                {fmt2(displayMul)}
                <span className={phase === "crashed" ? "text-red-300" : "text-emerald-300"}>×</span>
              </div>

              {phase === "waiting" ? (
                <div className="mt-2 text-sm text-white/60">
                  Next round in{" "}
                  <span className="font-semibold text-white">
                    {Math.ceil(countdownMs / 1000)}s
                  </span>
                </div>
              ) : phase === "running" ? (
                <div className="mt-2 text-sm text-white/60">
                  Cash out anytime — don’t get rekt.
                </div>
              ) : (
                <div className="mt-2 text-sm text-white/60">
                  Crashed at{" "}
                  <span className="font-semibold text-red-200">{fmt2(lastCrash)}×</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {/* history chips would be rendered outside; this component focuses on stage */}
        <span className="text-xs text-white/45">
          *Provably fair UI label only (demo).
        </span>
      </div>
    </Card>
  );
}
