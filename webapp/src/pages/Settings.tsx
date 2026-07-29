import { useEffect, useState } from "react";
import { useLLMStore } from "../store/llm";
import { fetchHealth } from "../api/client";
import { Cpu } from "lucide-react";

const PROVIDERS = [
  { name: "Ollama", port: 11434, base: "http://127.0.0.1:11434" },
  { name: "LM Studio", port: 1234, base: "http://127.0.0.1:1234" },
];

export function Settings() {
  const {
    detectedProviders,
    providerStatus,
    selectedProvider,
    selectedModel,
    availableModels,
    gpuDetected,
    setProviders,
    setSelectedProvider,
    setSelectedModel,
    setAvailableModels,
    setGpuDetected,
  } = useLLMStore();

  const [backendHealth, setBackendHealth] = useState<Record<string, unknown> | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    fetchHealth()
      .then((h) => setBackendHealth(h))
      .catch(() => setBackendHealth(null))
      .finally(() => setHealthLoading(false));
  }, []);

  useEffect(() => {
    const results: Record<string, "probing" | "detected" | "not_found"> = {};
    const detected: typeof detectedProviders = [];

    Promise.allSettled(
      PROVIDERS.map(async (p) => {
        try {
          const r = await fetch(`${p.base}/api/tags`, { signal: AbortSignal.timeout(3000) });
          if (r.ok) {
            results[p.name] = "detected";
            detected.push(p);
          } else {
            results[p.name] = "not_found";
          }
        } catch {
          results[p.name] = "not_found";
        }
      })
    ).then(() => {
      setProviders(detected, results);
      if (!selectedProvider && detected.length > 0) {
        setSelectedProvider(detected[0].name);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProvider) return;
    const provider = PROVIDERS.find((p) => p.name === selectedProvider);
    if (!provider) return;

    fetch(`${provider.base}/api/tags`, { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data: any) => {
        const models = (data.models || []).map((m: any) => m.name);
        setAvailableModels(models);
        if (models.length > 0 && !selectedModel) setSelectedModel(models[0]);
      })
      .catch(() => setAvailableModels([]));
  }, [selectedProvider]);

  useEffect(() => {
    try {
      const r = new XMLHttpRequest();
      r.open("GET", "http://127.0.0.1:11434/api/tags", true);
      r.timeout = 2000;
      r.onload = () => setGpuDetected(true);
      r.onerror = () => {
        const gpuCheck = navigator.userAgent.match(/NVIDIA|RTX|GTX|AMD Radeon/i);
        setGpuDetected(!!gpuCheck);
      };
      r.send();
    } catch {
      setGpuDetected(false);
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-100">Settings</h1>

      <section className="mb-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-200">Backend Health</h2>
        {healthLoading && <p className="text-sm text-gray-400">Checking...</p>}
        {backendHealth && (
          <pre className="overflow-x-auto rounded bg-gray-800 p-3 text-xs text-gray-300">
            {JSON.stringify(backendHealth, null, 2)}
          </pre>
        )}
      </section>

      <section className="mb-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-200">
          <Cpu className="h-4 w-4 text-amber-400" />
          Local LLM
        </h2>

        <div className="mb-4 space-y-2">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{p.name} (: {p.port})</span>
              <span
                className={`inline-flex items-center gap-1.5 ${
                  providerStatus[p.name] === "detected"
                    ? "text-green-400"
                    : providerStatus[p.name] === "probing"
                      ? "text-yellow-400"
                      : "text-gray-500"
                }`}
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    providerStatus[p.name] === "detected"
                      ? "bg-green-500"
                      : providerStatus[p.name] === "probing"
                        ? "bg-yellow-500"
                        : "bg-gray-600"
                  }`}
                />
                {providerStatus[p.name] === "detected"
                  ? "Detected"
                  : providerStatus[p.name] === "probing"
                    ? "Probing..."
                    : "Not found"}
              </span>
            </div>
          ))}
        </div>

        {gpuDetected && detectedProviders.length === 0 && (
          <div className="rounded border border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-300">
            High-performance GPU detected. Install Ollama or LM Studio to unlock AI features for free.
          </div>
        )}

        {detectedProviders.length > 0 && (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-gray-400">Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                data-testid="llm-provider-select"
              >
                {detectedProviders.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-400">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
                data-testid="llm-model-select"
              >
                {availableModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
