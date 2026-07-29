import { useEffect, useState } from "react";
import { fetchGateway, type GatewayProbe } from "../api/client";

export function Dashboard() {
  const [gateway, setGateway] = useState<GatewayProbe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGateway();
      setGateway(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setGateway(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-100 sm:text-3xl">
          Moltbot MCP Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Bridge to Moltbot Gateway. Status and health from Gateway WS.
        </p>
      </header>

      <section className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-200">Gateway</h2>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="rounded-md bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-200 hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Refresh"}
          </button>
        </div>

        {loading && !gateway && (
          <p className="mt-3 text-sm text-gray-400">Probing Gateway…</p>
        )}

        {error && (
          <p className="mt-3 text-sm text-amber-400">API error: {error}</p>
        )}

        {gateway && !loading && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  gateway.gateway_reachable ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-200">
                {gateway.gateway_reachable ? "Reachable" : "Unreachable"}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              <span className="font-mono">{gateway.gateway_url}</span>
            </p>
            {gateway.error && (
              <p className="text-sm text-amber-400">{gateway.error}</p>
            )}
            {(gateway as any).gateway_reachable && (gateway as any).status && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Status payload
                </summary>
                <pre className="mt-2 overflow-x-auto rounded bg-gray-800 p-3 text-xs text-gray-300">
                  {JSON.stringify((gateway as any).status, null, 2)}
                </pre>
              </details>
            )}
            {(gateway as any).gateway_reachable && (gateway as any).health && typeof (gateway as any).health === "object" && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Health payload
                </summary>
                <pre className="mt-2 overflow-x-auto rounded bg-gray-800 p-3 text-xs text-gray-300">
                  {JSON.stringify((gateway as any).health, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300">
            moltbot_ops
          </span>
          <span className="inline-flex items-center rounded-md bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300">
            help
          </span>
        </div>
      </section>

      <footer className="mt-12 border-t border-gray-800 pt-6 text-xs text-gray-500">
        <a
          href="https://docs.molt.bot"
          target="_blank"
          rel="noreferrer"
          className="hover:text-gray-400"
        >
          Moltbot docs
        </a>
        {" · "}
        <a
          href="https://github.com/sandraschi/mcp-central-docs/tree/main/docs/integrations#moltbot-clawdbot"
          target="_blank"
          rel="noreferrer"
          className="hover:text-gray-400"
        >
          MCP Central Moltbot series
        </a>
      </footer>
    </div>
  );
}
