import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "moltbot-overview", label: "Moltbot Overview" },
  { id: "moltbot-architecture", label: "Moltbot: Architecture & Gateway" },
  { id: "moltbot-channels", label: "Moltbot: Channels & Messaging" },
  { id: "moltbot-tools", label: "Moltbot: Tools & Skills" },
  { id: "moltbot-nodes", label: "Moltbot: Nodes & Devices" },
  { id: "moltbot-security", label: "Moltbot: Security & Sandbox" },
  { id: "mcp-overview", label: "MCP Server Overview" },
  { id: "mcp-moltbot-ops", label: "MCP Tool: moltbot_ops" },
  { id: "mcp-help", label: "MCP Tool: help" },
  { id: "mcp-config", label: "MCP Configuration" },
  { id: "mcp-usage", label: "MCP Usage Examples" },
  { id: "dashboard", label: "This Dashboard" },
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Docs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== "docs") {
      const el = document.getElementById(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 150);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto flex max-w-6xl px-4 py-8 sm:px-6 lg:px-8 ${sidebarOpen ? "gap-8" : ""}`}
    >
      {/* Backdrop when sidebar open on small screens */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close contents"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Retractable sidebar */}
      <aside
        className={`shrink-0 transition-[transform,width] duration-200 ease-out ${
          sidebarOpen
            ? "w-56 translate-x-0"
            : "w-0 -translate-x-full overflow-hidden lg:translate-x-0"
        } ${
          sidebarOpen
            ? "fixed left-0 top-14 bottom-0 z-50 flex w-56 flex-col border-r border-gray-800 bg-gray-950 pr-4 pt-6 lg:static lg:z-auto lg:bg-transparent lg:pt-0"
            : "lg:overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between gap-2 pr-2 lg:pr-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Contents
          </p>
          <button
            type="button"
            aria-label="Hide contents"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200 lg:block"
          >
            <span className="sr-only">Hide</span>
            <span aria-hidden className="text-sm">
              &#x25C0;
            </span>
          </button>
        </div>
        <nav className="mt-3 space-y-1 overflow-y-auto lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                scrollToSection(id);
                window.history.replaceState(null, "", `#${id}`);
                setSidebarOpen(false);
              }}
              className="block w-full text-left text-sm text-gray-400 hover:text-gray-200"
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Toggle when sidebar closed */}
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-20 z-30 flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-sm text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-200 lg:left-6 lg:top-20"
        >
          <span aria-hidden className="text-xs">
            &#x25B6;
          </span>
          <span>Contents</span>
        </button>
      )}

      <article className="min-w-0 flex-1 space-y-12 pb-16">
        <Section id="intro" title="Introduction">
          <p className="text-gray-300">
            This documentation covers{" "}
            <strong className="text-gray-200">Moltbot</strong> (formerly
            ClawdBot)—the open-source, local-first personal AI assistant—and the{" "}
            <strong className="text-gray-200">moltbot-mcp</strong> MCP server
            that bridges MCP clients (Cursor, Claude Desktop) to a running
            Moltbot Gateway.
          </p>
          <p className="mt-3 text-gray-300">
            Use the sidebar to jump to sections. External references:{" "}
            <a
              href="https://docs.molt.bot"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline"
            >
              docs.molt.bot
            </a>
            ,{" "}
            <a
              href="https://github.com/moltbot/moltbot"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline"
            >
              moltbot/moltbot
            </a>
            ,{" "}
            <a
              href="https://github.com/sandraschi/mcp-central-docs/tree/main/docs/integrations#moltbot-clawdbot"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline"
            >
              MCP Central Moltbot series
            </a>
            .
          </p>
        </Section>

        <Section id="moltbot-overview" title="Moltbot Overview">
          <p className="text-gray-300">
            Moltbot is an{" "}
            <strong className="text-gray-200">
              open-source, local-first personal AI assistant
            </strong>
            . You run a <strong className="text-gray-200">Gateway</strong>—a
            WebSocket control plane, typically on{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              127.0.0.1:18789
            </code>
            —that owns all messaging surfaces and talks to a{" "}
            <strong className="text-gray-200">Pi agent</strong> (RPC-style loop
            with tools). Orchestration and tool execution stay on your hardware;
            you bring your own LLM (Anthropic, OpenAI, local models). Data
            privacy is preserved except for the provider API calls you choose.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-gray-300">
            <li>
              <strong className="text-gray-200">Stack:</strong> Node 22+,
              TypeScript (ESM), pnpm, Vitest
            </li>
            <li>
              <strong className="text-gray-200">Config:</strong>{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                ~/.clawdbot/moltbot.json
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                ~/.clawdbot/credentials/
              </code>
            </li>
            <li>
              <strong className="text-gray-200">Workspace:</strong>{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">~/clawd</code>{" "}
              (configurable)
            </li>
          </ul>
          <p className="mt-3 text-gray-300">
            The project is widely described as a &quot;clever combo&quot; of
            familiar patterns: a single gateway, existing channel SDKs, a
            standard agent loop with tools, pairing/sandboxing, and a skills
            system. Leverage comes from{" "}
            <strong className="text-gray-200">composition</strong> and{" "}
            <strong className="text-gray-200">product focus</strong>.
          </p>
        </Section>

        <Section
          id="moltbot-architecture"
          title="Moltbot: Architecture & Gateway"
        >
          <p className="text-gray-300">
            One{" "}
            <strong className="text-gray-200">Gateway daemon per host</strong>.
            It owns all provider connections (WhatsApp, Telegram, Slack,
            Discord, etc.) and exposes a typed WebSocket API. Control-plane
            clients (macOS app, CLI, web UI) connect over WebSocket to the
            configured bind (default{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              127.0.0.1:18789
            </code>
            ). <strong className="text-gray-200">Nodes</strong>{" "}
            (macOS/iOS/Android/headless) connect with{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">role: node</code>{" "}
            and expose capability claims (camera, canvas,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">system.run</code>
            ).
          </p>
          <h4 className="mt-4 font-semibold text-gray-200">Protocol</h4>
          <ul className="mt-2 list-inside list-disc space-y-1 text-gray-300">
            <li>WebSocket, text frames, JSON payloads</li>
            <li>
              First frame must be{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">connect</code>{" "}
              (handshake)
            </li>
            <li>
              Post-handshake:{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">req</code> /{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">res</code> /{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">event</code>
            </li>
            <li>
              Methods:{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">health</code>,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">status</code>,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">send</code>,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">agent</code>,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                system-presence
              </code>
              , etc.
            </li>
          </ul>
          <h4 className="mt-4 font-semibold text-gray-200">Roles</h4>
          <p className="mt-2 text-gray-300">
            <strong className="text-gray-200">operator</strong> — Control-plane
            client (CLI, web UI, macOS app). Can call{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">agent</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">send</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">status</code>,
            etc. <strong className="text-gray-200">node</strong> — Capability
            host (camera, screen, canvas,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">system.run</code>
            ). Declares{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">caps</code> and{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">commands</code>.
          </p>
        </Section>

        <Section id="moltbot-channels" title="Moltbot: Channels & Messaging">
          <p className="text-gray-300">
            Moltbot supports many messaging surfaces. Each connects as a{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">client</code> to
            the Gateway and routes user messages into the Pi agent.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-gray-300">
            <li>
              <strong className="text-gray-200">WhatsApp</strong> via Baileys
              (unofficial, device-linked)
            </li>
            <li>
              <strong className="text-gray-200">Telegram</strong> via grammY
            </li>
            <li>
              <strong className="text-gray-200">Slack</strong> via Bolt
            </li>
            <li>
              <strong className="text-gray-200">Discord</strong> via discord.js
            </li>
            <li>
              <strong className="text-gray-200">Google Chat</strong>,{" "}
              <strong className="text-gray-200">Signal</strong> (signal-cli),{" "}
              <strong className="text-gray-200">iMessage</strong> (macOS),{" "}
              <strong className="text-gray-200">Microsoft Teams</strong>,{" "}
              <strong className="text-gray-200">Matrix</strong>,{" "}
              <strong className="text-gray-200">Zalo</strong>,{" "}
              <strong className="text-gray-200">WebChat</strong>
            </li>
          </ul>
          <p className="mt-3 text-gray-300">
            <strong className="text-gray-200">DM policy:</strong> By default
            only allowlisted contacts get replies (prevents spam). Group
            messages can run in{" "}
            <strong className="text-gray-200">sandbox</strong> mode with
            restricted tools. Allowlists are configured per channel in{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              config.yaml
            </code>
            .
          </p>
        </Section>

        <Section id="moltbot-tools" title="Moltbot: Tools & Skills">
          <p className="text-gray-300">
            The <strong className="text-gray-200">Pi agent</strong> exposes
            tools to the LLM. The Gateway wires them into the agent loop.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-gray-300">
            <li>
              <strong className="text-gray-200">Exec:</strong>{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">bash</code>,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">process</code>{" "}
              — shell and subprocess execution
            </li>
            <li>
              <strong className="text-gray-200">Browser:</strong> CDP-based
              control; snapshots, actions, profiles
            </li>
            <li>
              <strong className="text-gray-200">Canvas:</strong> A2UI
              push/reset, eval, snapshot
            </li>
            <li>
              <strong className="text-gray-200">Nodes:</strong>{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                camera.snap
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                screen.record
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                location.get
              </code>
              , etc. via{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                node.invoke
              </code>
            </li>
            <li>
              <strong className="text-gray-200">Sessions:</strong>{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                sessions_list
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                sessions_history
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                sessions_send
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                sessions_spawn
              </code>{" "}
              — agent-to-agent
            </li>
            <li>
              <strong className="text-gray-200">
                Cron, webhooks, Gmail Pub/Sub
              </strong>
            </li>
            <li>
              <strong className="text-gray-200">Skills:</strong>{" "}
              AgentSkills-compatible{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">SKILL.md</code>
              ; loaded from bundled, managed (
              <code className="rounded bg-gray-800 px-1 text-sm">
                ~/.clawdbot/skills
              </code>
              ), and workspace (
              <code className="rounded bg-gray-800 px-1 text-sm">
                &lt;workspace&gt;/skills
              </code>
              )
            </li>
          </ul>
          <p className="mt-3 text-gray-300">
            Sandbox mode (e.g. for groups) restricts which tools are available.
            Default sandbox allowlist:{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">bash</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">process</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">read</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">write</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">edit</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">sessions_*</code>
            ; denylist includes{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">browser</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">canvas</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">nodes</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">cron</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">gateway</code>.
          </p>
        </Section>

        <Section id="moltbot-nodes" title="Moltbot: Nodes & Devices">
          <p className="text-gray-300">
            <strong className="text-gray-200">Nodes</strong> are devices (macOS,
            iOS, Android, headless) that connect to the Gateway with{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">role: node</code>{" "}
            and declare{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">caps</code> and{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">commands</code>.
            The Gateway enforces allowlists when routing{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              node.invoke
            </code>
            .
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 text-gray-300">
            <li>
              <strong className="text-gray-200">Caps:</strong> camera, canvas,
              screen, location, voice
            </li>
            <li>
              <strong className="text-gray-200">Commands:</strong>{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                camera.snap
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                canvas.navigate
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                screen.record
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                location.get
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                system.run
              </code>
              ,{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                system.notify
              </code>
            </li>
            <li>
              <strong className="text-gray-200">macOS app:</strong> Menu bar,
              Voice Wake, Talk Mode, Canvas
            </li>
          </ul>
          <p className="mt-3 text-gray-300">
            Pairing is device-based. New device IDs require approval; the
            Gateway issues a device token for subsequent connects. Local
            connects (loopback) can be auto-approved.
          </p>
        </Section>

        <Section id="moltbot-security" title="Moltbot: Security & Sandbox">
          <p className="text-gray-300">
            <strong className="text-gray-200">Gateway token:</strong> If{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              CLAWDBOT_GATEWAY_TOKEN
            </code>{" "}
            is set,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              connect.params.auth.token
            </code>{" "}
            must match or the socket is closed.
          </p>
          <p className="mt-3 text-gray-300">
            <strong className="text-gray-200">Sandbox:</strong> Docker-based
            isolation for non-main sessions (e.g. groups, untrusted inputs).
            Restricts tool access; configurable per session type. Default
            sandbox allowlist/denylist documented in Tools &amp; Skills.
          </p>
          <p className="mt-3 text-gray-300">
            <strong className="text-gray-200">Remote access:</strong> Tailscale
            Serve/Funnel or SSH tunnels. Gateway can stay bound to loopback; TLS
            supported for WS with optional cert pinning.
          </p>
        </Section>

        <Section id="mcp-overview" title="MCP Server Overview">
          <p className="text-gray-300">
            <strong className="text-gray-200">moltbot-mcp</strong> is a FastMCP
            2.14+ MCP server that bridges MCP clients (Cursor, Claude Desktop)
            to a local Moltbot Gateway. It exposes two tools—
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot_ops
            </code>{" "}
            and <code className="rounded bg-gray-800 px-1 text-sm">help</code>
            —and runs over stdio. The Gateway is reached at{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              MOLTBOT_MCP_GATEWAY_HOST
            </code>
            :
            <code className="rounded bg-gray-800 px-1 text-sm">
              MOLTBOT_MCP_GATEWAY_PORT
            </code>{" "}
            (default{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              127.0.0.1:18789
            </code>
            ).
          </p>
          <p className="mt-3 text-gray-300">
            Use the MCP server from Cursor, Claude Desktop, or any MCP client.
            Add the server via your client config (e.g. Cursor MCP settings,
            Claude Desktop{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              claude_desktop_config.json
            </code>
            ) and point the command to{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot-mcp
            </code>{" "}
            or{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              python -m moltbot_mcp
            </code>
            .
          </p>
        </Section>

        <Section id="mcp-moltbot-ops" title="MCP Tool: moltbot_ops">
          <p className="text-gray-300">
            <strong className="text-gray-200">moltbot_ops</strong> is a
            portmanteau tool. Pass{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">operation</code>{" "}
            and optional arguments. All operations return a dict with{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">success</code>,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">message</code>,
            and <code className="rounded bg-gray-800 px-1 text-sm">result</code>{" "}
            (or <code className="rounded bg-gray-800 px-1 text-sm">error</code>
            ).
          </p>
          <table className="mt-4 min-w-full border border-gray-700 text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/80">
                <th className="px-3 py-2 text-left font-medium text-gray-200">
                  operation
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200">
                  Required args
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">status</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">Gateway and session status</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">health</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">Gateway health snapshot</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">send</td>
                <td className="px-3 py-2">
                  <code className="rounded bg-gray-800 px-1">message</code>,{" "}
                  <code className="rounded bg-gray-800 px-1">to</code>
                </td>
                <td className="px-3 py-2">
                  Send message via Moltbot to a recipient (e.g. phone, channel
                  id)
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">agent</td>
                <td className="px-3 py-2">
                  <code className="rounded bg-gray-800 px-1">message</code>
                </td>
                <td className="px-3 py-2">
                  Trigger agent run. Optional{" "}
                  <code className="rounded bg-gray-800 px-1">thinking</code>:
                  off, minimal, low, medium, high, xhigh (default low)
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">channels</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">
                  List connected channels and their status
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-3 text-gray-300">
            Example (pseudo):{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot_ops(operation=&quot;status&quot;)
            </code>
            ,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot_ops(operation=&quot;send&quot;, message=&quot;Hi&quot;,
              to=&quot;+1234567890&quot;)
            </code>
            ,{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot_ops(operation=&quot;agent&quot;, message=&quot;Summarize
              today&quot;, thinking=&quot;low&quot;)
            </code>
            .
          </p>
        </Section>

        <Section id="mcp-help" title="MCP Tool: help">
          <p className="text-gray-300">
            <strong className="text-gray-200">help</strong> returns multilevel
            documentation. Parameters:
          </p>
          <ul className="mt-2 list-inside list-disc text-gray-300">
            <li>
              <code className="rounded bg-gray-800 px-1 text-sm">level</code>{" "}
              (default{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">basic</code>):{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">basic</code> |{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                intermediate
              </code>{" "}
              |{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">advanced</code>{" "}
              | <code className="rounded bg-gray-800 px-1 text-sm">expert</code>
            </li>
            <li>
              <code className="rounded bg-gray-800 px-1 text-sm">topic</code>{" "}
              (optional):{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">tools</code> |{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">config</code> |{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">examples</code>{" "}
              |{" "}
              <code className="rounded bg-gray-800 px-1 text-sm">
                troubleshooting
              </code>
            </li>
          </ul>
          <p className="mt-3 text-gray-300">
            Returns Markdown help content. Use it from an MCP client when the
            model needs guidance on Moltbot or moltbot-mcp.
          </p>
        </Section>

        <Section id="mcp-config" title="MCP Configuration">
          <p className="text-gray-300">
            Configuration uses environment variables with prefix{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              MOLTBOT_MCP_
            </code>
            . A <code className="rounded bg-gray-800 px-1 text-sm">.env</code>{" "}
            in the working directory is loaded if present.
          </p>
          <table className="mt-4 min-w-full border border-gray-700 text-sm">
            <thead>
              <tr className="border-b border-gray-700 bg-gray-800/80">
                <th className="px-3 py-2 text-left font-medium text-gray-200">
                  Variable
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200">
                  Default
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-200">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">GATEWAY_HOST</td>
                <td className="px-3 py-2">127.0.0.1</td>
                <td className="px-3 py-2">Moltbot Gateway host</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">GATEWAY_PORT</td>
                <td className="px-3 py-2">18789</td>
                <td className="px-3 py-2">Gateway port</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">GATEWAY_TOKEN</td>
                <td className="px-3 py-2">—</td>
                <td className="px-3 py-2">
                  Optional; required if Gateway enforces token auth
                </td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-3 py-2 font-mono">USE_WS</td>
                <td className="px-3 py-2">true</td>
                <td className="px-3 py-2">Use WebSocket (vs HTTP)</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section id="mcp-usage" title="MCP Usage Examples">
          <h4 className="font-semibold text-gray-200">
            Run MCP server (stdio)
          </h4>
          <pre className="mt-2 overflow-x-auto rounded bg-gray-800 p-3 text-xs text-gray-300">
            {`uv run moltbot-mcp
# or
python -m moltbot_mcp`}
          </pre>
          <h4 className="mt-4 font-semibold text-gray-200">Cursor</h4>
          <p className="mt-2 text-gray-300">
            Add in Cursor MCP settings. Command:{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot-mcp
            </code>{" "}
            or{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              uv run moltbot-mcp
            </code>
            , args: <code className="rounded bg-gray-800 px-1 text-sm">[]</code>
            , cwd: repo root. Ensure Gateway is running if you want
            status/send/agent to work.
          </p>
          <h4 className="mt-4 font-semibold text-gray-200">Claude Desktop</h4>
          <p className="mt-2 text-gray-300">
            In{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              claude_desktop_config.json
            </code>
            , add an entry under{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              mcp.servers
            </code>{" "}
            with{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">command</code>{" "}
            pointing to{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              moltbot-mcp
            </code>{" "}
            or{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              uv run moltbot-mcp
            </code>{" "}
            and <code className="rounded bg-gray-800 px-1 text-sm">cwd</code> to
            the moltbot-mcp repo.
          </p>
        </Section>

        <Section id="dashboard" title="This Dashboard">
          <p className="text-gray-300">
            This web UI (Moltbot MCP Dashboard) shows{" "}
            <strong className="text-gray-200">Gateway reachability</strong> and,
            when the Gateway is up,{" "}
            <strong className="text-gray-200">status</strong> and{" "}
            <strong className="text-gray-200">health</strong> payloads. It talks
            to a small FastAPI backend (default port{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">18101</code>)
            that opens a WebSocket to the Gateway, sends a{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">connect</code>{" "}
            handshake, and optionally a{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">health</code>{" "}
            request.
          </p>
          <p className="mt-3 text-gray-300">
            <strong className="text-gray-200">Run:</strong> Start the API with{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              uv run --extra web python webapp/server.py
            </code>{" "}
            (or{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              .\webapp\run-api.ps1
            </code>
            ), then run the frontend with{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">
              npm run dev
            </code>{" "}
            in <code className="rounded bg-gray-800 px-1 text-sm">webapp</code>.
            Open http://localhost:18100. The frontend proxies{" "}
            <code className="rounded bg-gray-800 px-1 text-sm">/api</code> to
            the backend.
          </p>
        </Section>
      </article>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2 mb-4">
        {title}
      </h2>
      <div className="prose prose-invert max-w-none text-gray-300">
        {children}
      </div>
    </section>
  );
}
