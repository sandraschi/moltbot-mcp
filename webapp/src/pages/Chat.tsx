import { Download, Eraser, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLLMStore } from "../store/llm";

const STORAGE_KEY = "moltbot-mcp-chat-history";
const PERSONALITY_KEY = "moltbot-mcp-chat-personality";
const MAX_MESSAGES = 100;
const SKILL_PREPROMPT =
  "You are an AI assistant with access to the Moltbot Gateway. You can check gateway status, send messages, run the agent, and list channels. Use moltbot_ops for all gateway operations. Be concise and helpful.";

const PERSONALITIES: Record<string, string> = {
  assistant: "You are a helpful assistant. Answer concisely and accurately.",
  expert:
    "You are an expert Moltbot Gateway operator. Provide detailed technical guidance.",
  summarizer: "You are a summarizer. Keep responses brief and to the point.",
  custom: "",
};

const EXAMPLE_PROMPTS: { label: string; text: string }[] = [
  { label: "Status", text: "Check gateway status" },
  { label: "Send", text: "Send a message via gateway" },
  { label: "Channels", text: "List gateway channels" },
  { label: "Help", text: "How do I use this server?" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
  ts?: string;
}

export function Chat() {
  const { selectedProvider, selectedModel, detectedProviders } = useLLMStore();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState(
    () => localStorage.getItem(PERSONALITY_KEY) || "assistant",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll-on-mount only; the ref object is stable and deliberately not subscribed.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_MESSAGES)),
    );
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(PERSONALITY_KEY, personality);
  }, [personality]);

  const buildSystemPrompt = useCallback(() => {
    const role = PERSONALITIES[personality] || PERSONALITIES.assistant;
    return `${SKILL_PREPROMPT}\n\n---\n\n## Role\n${role}`;
  }, [personality]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      ts: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const provider = detectedProviders.find(
        (p) => p.name === selectedProvider,
      );
      const baseUrl = provider
        ? `http://127.0.0.1:${provider.port}`
        : "http://127.0.0.1:11434";
      const model = selectedModel || "llama3";

      const r = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...messages
              .slice(-10)
              .map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: input.trim() },
          ],
          stream: false,
        }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const reply = data.choices?.[0]?.message?.content || "No response";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, ts: new Date().toISOString() },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${e instanceof Error ? e.message : String(e)}`,
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    input,
    loading,
    messages,
    selectedProvider,
    selectedModel,
    detectedProviders,
    buildSystemPrompt,
  ]);

  const handleExport = () => {
    if (messages.length === 0) return;
    const text = messages
      .map((m) => `[${m.ts || "?"}] ${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moltbot-chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasLLM = detectedProviders.length > 0;

  return (
    <div
      className="mx-auto flex max-w-4xl flex-col px-4 py-6 sm:px-6"
      data-testid="chat-page"
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-100">Chat</h1>
        <div className="flex items-center gap-3">
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="rounded border border-zinc-600 bg-zinc-800 px-2 py-1 text-sm text-zinc-100"
            data-testid="personality-select"
          >
            {Object.keys(PERSONALITIES).map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleExport}
            disabled={messages.length === 0}
            className="rounded p-1.5 text-gray-400 hover:text-gray-200 disabled:opacity-30"
            data-testid="chat-export"
            title="Export chat"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={messages.length === 0}
            className="rounded p-1.5 text-gray-400 hover:text-gray-200 disabled:opacity-30"
            data-testid="chat-clear"
            title="Clear chat"
          >
            <Eraser className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!hasLLM && (
        <div className="mb-4 rounded border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-300">
          No local LLM detected. Start Ollama or LM Studio to enable AI
          features.
        </div>
      )}

      <div
        className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-lg border border-gray-800 bg-gray-900/50 p-4"
        style={{ maxHeight: "60vh" }}
        data-testid="chat-messages"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2 text-sm">Ask a question or try an example:</p>
            <div className="flex flex-wrap gap-2" data-testid="example-prompts">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setInput(p.text)}
                  className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:border-gray-600 hover:text-gray-200"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={`${m.ts ?? "local"}-${m.role}-${m.content.length}`}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-gray-800 px-3 py-2 text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder={hasLLM ? "Type a message..." : "LLM not available"}
          disabled={!hasLLM || loading}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          data-testid="chat-input"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!hasLLM || loading || !input.trim()}
          className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500 disabled:opacity-50"
          data-testid="chat-send"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
