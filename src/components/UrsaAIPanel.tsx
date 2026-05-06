import { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, Mic, ArrowUp, Check, History, Maximize2, X, MessageSquarePlus } from "lucide-react";

// ── Mode selector ─────────────────────────────────────────────────────────────

const modes = [
  {
    id: "agent",
    label: "Agent",
    description: "Uses advanced tools for automation and filtering but may respond slower. Best for complex tasks.",
  },
  {
    id: "ask",
    label: "Ask",
    description: "Answer-only mode that ensures the AI can't modify any data for security and control.",
  },
] as const;

type Mode = (typeof modes)[number]["id"];

// ── Quick actions ─────────────────────────────────────────────────────────────

const quickActions = [
  { label: "Brainstorm",          prompt: "Help me brainstorm ideas for my account",   icon: "/icons/braincog.svg" },
  { label: "Create a form",       prompt: "Help me create a form",                     icon: "/icons/clipboardlist.svg" },
  { label: "Create a collection", prompt: "Help me create a new collection",           icon: "/icons/layoutgrid.svg" },
  { label: "Create fields",       prompt: "Help me create fields for my collection",   icon: "/icons/columns3.svg" },
  { label: "Surprise me",         prompt: "Suggest something useful I can do",         icon: "/icons/refreshccw.svg" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface UrsaAIPanelProps {
  open: boolean;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function UrsaAIPanel({ open, onClose }: UrsaAIPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMode, setSelectedMode] = useState<Mode>("ask");
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const modePopoverRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        modePopoverRef.current &&
        !modePopoverRef.current.contains(e.target as Node) &&
        !modeButtonRef.current?.contains(e.target as Node)
      ) {
        setShowModeSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      text: "I'm a prototype — but I'd be happy to help with that once I'm connected to the real AI backend!",
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-20 bg-black/10 transition-opacity duration-300 pointer-events-none md:hidden ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Panel */}
      <div
        className="flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out border-r bg-white"
        style={{ width: open ? 360 : 0, minWidth: open ? 360 : 0, opacity: open ? 1 : 0, zIndex: 10 }}
      >
        <div className="flex flex-col h-full" style={{ width: 360 }}>

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <p className="font-bold text-sm text-foreground leading-none">
              Ursa<span className="text-[9px] font-bold align-super">AI</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                title="New chat"
                onClick={() => setMessages([])}
                className="flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-foreground"
                style={{ width: 32, height: 32 }}
              >
                <MessageSquarePlus size={16} />
              </button>
              <button
                title="History"
                className="flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-foreground"
                style={{ width: 28, height: 28 }}
              >
                <History size={16} />
              </button>
              <button
                title="Expand"
                className="flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-foreground"
                style={{ width: 28, height: 28 }}
              >
                <Maximize2 size={16} />
              </button>
              <button
                title="Close"
                onClick={onClose}
                className="flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer text-foreground"
                style={{ width: 28, height: 28 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="flex flex-col flex-1 min-h-0 justify-between p-6">

            {/* Top: empty state OR conversation */}
            {hasConversation ? (
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "assistant" && (
                      <img src="/panda-logo.svg" alt="Bot" className="flex-shrink-0 mt-0.5" style={{ width: 24, height: 28 }} />
                    )}
                    <div
                      className={`text-sm leading-5 px-3 py-2 rounded-2xl max-w-[240px] ${
                        msg.role === "user"
                          ? "bg-[#401e5a] text-white rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              /* Empty state — vertically centered */
              <div className="flex-1 flex flex-col items-center justify-center gap-6 min-h-0">
                {/* Logo + greeting */}
                <div className="flex flex-col gap-4 items-center w-full">
                  <img src="/panda-logo.svg" alt="Asset Panda" style={{ width: 48, height: 56 }} />
                  <div className="flex flex-col gap-2 w-full text-center">
                    <div className="flex flex-col w-full">
                      <p className="text-[18px] font-medium text-muted-foreground leading-7">Hi Brendan,</p>
                      <p className="text-[18px] font-bold text-foreground leading-7">Welcome back! How can I help?</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-5">
                      I'm here to help tackle your tasks. Choose from the prompts below or tell me what you need!
                    </p>
                  </div>
                </div>

                {/* Badges — wrapping flex, centered */}
                <div className="flex flex-wrap gap-2 items-start justify-center w-[312px]">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => sendMessage(action.prompt)}
                      className="flex items-center gap-2 h-8 border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
                    >
                      <img src={action.icon} alt="" style={{ width: 16, height: 16 }} className="flex-shrink-0" />
                      <span className="text-xs text-foreground leading-4 whitespace-nowrap">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Bottom: input + footer ── */}
            <div className="relative flex flex-col gap-1 w-[312px] mx-auto flex-shrink-0 mt-6">

              {/* Mode selector popover */}
              {showModeSelect && (
                <div
                  ref={modePopoverRef}
                  className="absolute bottom-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-lg border border-border overflow-hidden z-20"
                >
                  {modes.map((mode) => {
                    const isSelected = selectedMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => { setSelectedMode(mode.id); setShowModeSelect(false); }}
                        className="w-full text-left px-4 py-4 transition-colors cursor-pointer"
                        style={{ background: isSelected ? "#f0fdf9" : "white" }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <p className="font-bold text-sm leading-5" style={{ color: isSelected ? "#00a572" : "#0a0a0a" }}>
                              {mode.label}
                            </p>
                            <p className="text-xs leading-4 text-muted-foreground">
                              {mode.description}
                            </p>
                          </div>
                          {isSelected && <Check size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#00a572" }} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* InputGroup */}
              <div className="border border-border rounded-md bg-white w-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                {/* Textarea */}
                <div className="p-3 flex items-start" style={{ height: 64 }}>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening…" : "Ask, Search or Chat..."}
                    className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground leading-5 resize-none w-full text-foreground"
                    style={{ height: "100%", overflow: "hidden" }}
                  />
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 pb-3 pt-1.5">
                  {/* Left: + and mode selector */}
                  <div className="flex items-center gap-2">
                    <button
                      title="Attach"
                      className="flex items-center justify-center border border-border rounded-full hover:bg-muted transition-colors cursor-pointer flex-shrink-0"
                      style={{ width: 24, height: 24 }}
                    >
                      <Plus size={12} className="text-foreground" />
                    </button>
                    <button
                      ref={modeButtonRef}
                      title="Model"
                      onClick={() => setShowModeSelect((v) => !v)}
                      className="flex items-center gap-1 rounded-md px-2 hover:bg-muted transition-colors cursor-pointer"
                      style={{ height: 24 }}
                    >
                      <span className="text-xs text-foreground leading-4 capitalize">{selectedMode}</span>
                      <ChevronDown size={12} className="text-foreground" />
                    </button>
                  </div>

                  {/* Right: Mic and Send */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 24, height: 24 }}>
                      {isListening && (
                        <span className="absolute inset-0 rounded-md animate-ping bg-[#00a991]/30" />
                      )}
                      <button
                        title={isListening ? "Stop listening" : "Voice input"}
                        onClick={() => setIsListening((v) => !v)}
                        className="relative flex items-center justify-center rounded-md transition-colors cursor-pointer flex-shrink-0"
                        style={{
                          width: 24,
                          height: 24,
                          background: isListening ? "#00a991" : "transparent",
                          border: isListening ? "none" : "1px solid var(--border)",
                        }}
                      >
                        <Mic size={12} className={isListening ? "text-white" : "text-foreground"} />
                      </button>
                    </div>
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim()}
                      title="Send"
                      className="flex items-center justify-center rounded-full cursor-pointer flex-shrink-0 disabled:cursor-default transition-opacity duration-150"
                      style={{ width: 24, height: 24, background: "#00a991", opacity: input.trim() ? 1 : 0.5 }}
                    >
                      <ArrowUp size={12} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <p className="text-xs text-foreground text-center leading-4">
                Bot can make mistakes. Please double-check responses.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
