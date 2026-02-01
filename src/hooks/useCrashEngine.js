import { useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "../utils/format";

/**
 * Demo crash engine (frontend-only)
 * States:
 * - waiting: countdown before next round
 * - running: multiplier increases until crashAt
 * - crashed: short freeze to show crash result
 */
export function useCrashEngine({
  roundDelayMs = 4500,
  crashFreezeMs = 2200,
  seed = "demo",
} = {}) {
  const rafRef = useRef(0);
  const t0Ref = useRef(0);
  const crashAtRef = useRef(2.0);

  const [phase, setPhase] = useState("waiting"); // waiting | running | crashed
  const [countdownMs, setCountdownMs] = useState(roundDelayMs);
  const [multiplier, setMultiplier] = useState(1.0);
  const [lastCrash, setLastCrash] = useState(1.0);
  const [nonce, setNonce] = useState(1842);

  const demoHistory = useRef([1.12, 2.45, 1.03, 6.82, 1.08, 3.21, 1.24]);

  const history = demoHistory.current;

  const nextCrashAt = useMemo(() => {
    // pseudo-random but stable-ish per round; not real fairness.
    // Bias towards low multipliers with occasional big spikes.
    const r = Math.random();
    let crashAt;
    if (r < 0.68) crashAt = 1 + Math.random() * 1.4; // 1.0 - 2.4
    else if (r < 0.93) crashAt = 2.0 + Math.random() * 3.2; // 2.0 - 5.2
    else crashAt = 5.0 + Math.random() * 20.0; // 5 - 25
    return clamp(crashAt, 1.01, 50);
  }, [nonce, seed]);

  // growth curve: gentle exponential-ish
  function mulAtTime(ms) {
    const t = Math.max(0, ms) / 1000;
    // 1 + (exp(k t) - 1) -> grows steadily
    const k = 0.58;
    return 1 + (Math.exp(k * t) - 1);
  }

  useEffect(() => {
    function stop() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    function tick(now) {
      if (!t0Ref.current) t0Ref.current = now;

      if (phase === "waiting") {
        // countdown
        const elapsed = now - t0Ref.current;
        const remain = Math.max(0, roundDelayMs - elapsed);
        setCountdownMs(remain);

        if (remain <= 0) {
          // start running
          t0Ref.current = now;
          crashAtRef.current = nextCrashAt;
          setMultiplier(1.0);
          setPhase("running");
          setCountdownMs(roundDelayMs);
        }
      } else if (phase === "running") {
        const elapsed = now - t0Ref.current;
        const m = mulAtTime(elapsed);
        const mClamped = Math.min(m, crashAtRef.current);
        setMultiplier(mClamped);

        if (m >= crashAtRef.current) {
          // crash!
          setLastCrash(crashAtRef.current);
          // push history
          history.unshift(crashAtRef.current);
          history.splice(10);
          setPhase("crashed");
          t0Ref.current = now;
        }
      } else if (phase === "crashed") {
        const elapsed = now - t0Ref.current;
        if (elapsed >= crashFreezeMs) {
          setNonce((n) => n + 1);
          setPhase("waiting");
          t0Ref.current = now;
          setMultiplier(1.0);
          setCountdownMs(roundDelayMs);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    stop();
    t0Ref.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, roundDelayMs, crashFreezeMs, nextCrashAt]);

  return {
    phase,
    multiplier,
    lastCrash,
    countdownMs,
    nonce,
    crashAt: crashAtRef.current,
    history,
  };
}
