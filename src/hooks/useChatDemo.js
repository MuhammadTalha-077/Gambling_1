import { useEffect, useMemo, useRef, useState } from "react";

const USERS = ["Ayaan", "Zara", "Rex", "Nova", "Khan", "Dre", "braz", "Luna", "ZK_Star", "Sami"];
const LINES = [
  "gg",
  "cashout 2x easy 😄",
  "rip 😭",
  "big round incoming",
  "anyone playing coinflip?",
  "wallet lagging for me",
  "nice line 🔥",
  "i'm going 5x",
  "pls don't crash early",
  "W round",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeMsg(id) {
  return {
    id,
    user: pick(USERS),
    text: pick(LINES),
    ts: Date.now(),
  };
}

/**
 * Demo chat (frontend-only)
 * - random incoming messages
 * - local send
 */
export function useChatDemo() {
  const [messages, setMessages] = useState(() => {
    const seed = Array.from({ length: 18 }).map((_, i) => makeMsg(i + 1));
    seed.sort((a, b) => a.ts - b.ts);
    return seed;
  });
  const [online, setOnline] = useState(328);
  const idRef = useRef(messages.length + 1);

  useEffect(() => {
    const t = setInterval(() => {
      setMessages((m) => {
        const next = m.concat(makeMsg(idRef.current++));
        return next.slice(-120);
      });
      setOnline((o) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(120, o + delta);
      });
    }, 2600);

    return () => clearInterval(t);
  }, []);

  function send(text) {
    const clean = (text || "").trim();
    if (!clean) return;
    setMessages((m) =>
      m.concat({
        id: idRef.current++,
        user: "You",
        text: clean,
        ts: Date.now(),
      })
    );
  }

  return { messages, send, online };
}
