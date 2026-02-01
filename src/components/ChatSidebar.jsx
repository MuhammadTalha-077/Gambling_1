import { useEffect, useRef, useState } from "react";
import Card from "./ui/Card";
import Pill from "./ui/Pill";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { useChatDemo } from "../hooks/useChatDemo";

function timeFmt(ts) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function Msg({ m }) {
  const isYou = m.user === "You";
  return (
    <div className={`flex gap-2 ${isYou ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed
          ${isYou
            ? "bg-emerald-400/15 border border-emerald-400/20 text-white"
            : "bg-black/30 border border-white/10 text-white/90"}`}
      >
        {!isYou ? (
          <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-white/55">
            <span className="font-semibold text-white/70">{m.user}</span>
            <span>{timeFmt(m.ts)}</span>
          </div>
        ) : (
          <div className="mb-1 flex items-center justify-end gap-3 text-[11px] text-white/55">
            <span>{timeFmt(m.ts)}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap break-words">{m.text}</div>
      </div>
    </div>
  );
}

export default function ChatSidebar() {
  const { messages, send, online } = useChatDemo();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("chat"); // chat | rooms

  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length, open, tab]);

  function onSubmit(e) {
    e.preventDefault();
    send(text);
    setText("");
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-white/10 bg-white/10 backdrop-blur px-4 py-3 text-sm font-semibold shadow-glow"
        >
          {open ? "Close Chat" : "Open Chat"}
        </button>
      </div>

      <aside
        className={`${
          open ? "translate-x-0" : "translate-x-full"
        } fixed right-0 top-0 z-40 h-full w-[360px] max-w-[92vw] border-l border-white/10 bg-[#07090f]/80 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 lg:w-[360px] lg:bg-transparent lg:backdrop-blur-0`}
      >
        <div className="h-full p-4 lg:p-0">
          <Card
            title="Chat"
            right={
              <div className="flex items-center gap-2">
                <Pill className="text-emerald-300/80 border-emerald-400/20 bg-emerald-400/10">
                  ● {online} online
                </Pill>
                <button
                  onClick={() => setOpen(false)}
                  className="lg:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  type="button"
                >
                  ✕
                </button>
              </div>
            }
            className="h-full"
          >
            {/* Tabs */}
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setTab("chat")}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition
                  ${tab === "chat" ? "bg-white/10" : "bg-white/5 hover:bg-white/10 text-white/75"}`}
              >
                Global
              </button>
              <button
                type="button"
                onClick={() => setTab("rooms")}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition
                  ${tab === "rooms" ? "bg-white/10" : "bg-white/5 hover:bg-white/10 text-white/75"}`}
              >
                Rooms
              </button>
            </div>

            {tab === "rooms" ? (
              <div className="space-y-2">
                {["# general", "# whales", "# pakistan", "# beginners"].map((r) => (
                  <div
                    key={r}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                  >
                    <div className="text-sm font-semibold text-white/85">{r}</div>
                    <Pill className="text-white/60">{Math.floor(20 + Math.random() * 180)}</Pill>
                  </div>
                ))}
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                  Rooms are demo UI only. Hook to your backend to join channels.
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div
                  ref={listRef}
                  className="h-[calc(100vh-260px)] lg:h-[540px] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-3 space-y-2"
                >
                  {messages.map((m) => (
                    <Msg key={m.id} m={m} />
                  ))}
                </div>

                {/* Composer */}
                <form onSubmit={onSubmit} className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type a message…"
                      className="h-12"
                    />
                    <Button type="submit" className="px-5">
                      Send
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/45">
                    <span>Be respectful. No spam.</span>
                    <span className="hidden sm:inline">Enter to send</span>
                  </div>
                </form>
              </>
            )}
          </Card>
        </div>
      </aside>
    </>
  );
}
