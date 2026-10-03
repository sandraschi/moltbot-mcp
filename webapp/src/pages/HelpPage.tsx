import { BookOpen, MessageSquare, Settings2, Wrench } from "lucide-react";

export function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-100">Help</h1>

      <div className="space-y-6">
        <Section
          icon={<BookOpen className="h-4 w-4 text-blue-400" />}
          title="About"
        >
          <p className="text-sm text-gray-300">
            Moltbot MCP bridges MCP clients (Cursor, Claude Desktop) to a local
            Moltbot (ClawdBot) Gateway. The Gateway is a WebSocket control plane
            that manages messaging channels and agent execution.
          </p>
        </Section>

        <Section
          icon={<Wrench className="h-4 w-4 text-green-400" />}
          title="Tools"
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
            <li>
              <strong>moltbot_ops</strong> — status, health, send, agent,
              channels
            </li>
            <li>
              <strong>help</strong> — multilevel documentation
            </li>
            <li>
              <strong>moltbot_shutdown</strong> — gracefully stop the server
            </li>
            <li>
              <strong>show_moltbot_status_card</strong> — rich Prefab status
              card
            </li>
          </ul>
        </Section>

        <Section
          icon={<Settings2 className="h-4 w-4 text-amber-400" />}
          title="Configuration"
        >
          <p className="text-sm text-gray-300">
            Set environment variables with prefix{" "}
            <code className="rounded bg-gray-800 px-1">MOLTBOT_MCP_</code>:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-300">
            <li>
              <code className="rounded bg-gray-800 px-1">GATEWAY_HOST</code> —
              default 127.0.0.1
            </li>
            <li>
              <code className="rounded bg-gray-800 px-1">GATEWAY_PORT</code> —
              default 18789
            </li>
            <li>
              <code className="rounded bg-gray-800 px-1">GATEWAY_TOKEN</code> —
              optional auth token
            </li>
            <li>
              <code className="rounded bg-gray-800 px-1">USE_WS</code> — use
              WebSocket (default true)
            </li>
          </ul>
        </Section>

        <Section
          icon={<MessageSquare className="h-4 w-4 text-purple-400" />}
          title="Troubleshooting"
        >
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
            <li>
              Ensure Moltbot Gateway is running on the configured host:port
            </li>
            <li>Check the Logs modal for error details</li>
            <li>The backend API runs on port 10731, frontend on 10730</li>
            <li>Use the Settings page to check backend health</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-base font-medium text-gray-200">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
