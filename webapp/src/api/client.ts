const API_BASE = "/api";

export interface GatewayProbe {
  gateway_reachable: boolean;
  gateway_url: string;
  error: string | null;
  health: unknown;
  status: unknown;
  channels: unknown;
}

export interface LogEntry {
  ts: string;
  level: string;
  name: string;
  message: string;
}

export interface LogsResponse {
  ok: boolean;
  entries: LogEntry[];
  count: number;
  error?: string;
}

export async function fetchGateway(): Promise<GatewayProbe> {
  const r = await fetch(`${API_BASE}/gateway`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

export async function fetchLogs(limit = 200): Promise<LogsResponse> {
  const r = await fetch(`${API_BASE}/logs?limit=${limit}`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}
