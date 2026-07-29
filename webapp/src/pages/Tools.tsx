import { useEffect, useState } from "react";
import { fetchCapabilities, type ToolInfo } from "../api/client";
import { Wrench } from "lucide-react";

export function Tools() {
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCapabilities()
      .then((c) => {
        setTools(c.tools || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-100">Tools</h1>
      {loading && <p className="text-sm text-gray-400">Loading tools...</p>}
      {error && <p className="text-sm text-red-400">Error: {error}</p>}
      {!loading && !error && tools.length === 0 && (
        <p className="text-sm text-gray-500">No tools discovered.</p>
      )}
      <div className="space-y-3">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
          >
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-400" />
              <h3 className="font-mono text-sm font-medium text-gray-200">{tool.name}</h3>
            </div>
            {tool.description && (
              <p className="mt-1 text-sm text-gray-400">{tool.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
