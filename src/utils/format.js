export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function fmt2(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "0.00";
  return v.toFixed(2);
}

export function fmt3(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "0.000";
  return v.toFixed(3);
}

export function shortAddr(addr) {
  if (!addr) return "";
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}
