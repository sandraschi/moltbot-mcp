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

export interface ToolInfo {
  name: string;
  description: string;
}

export interface Capabilities {
  service: string;
  version: string;
  capabilities: Record<string, boolean>;
  tools: ToolInfo[];
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

export async function fetchCapabilities(): Promise<Capabilities> {
  const r = await fetch(`${API_BASE}/capabilities`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

export async function fetchSkills(): Promise<string[]> {
  const r = await fetch(`${API_BASE}/skills`);
  if (!r.ok) return [];
  return r.json();
}

export async function fetchSkillContent(name: string): Promise<string> {
  const r = await fetch(`${API_BASE}/skills/${name}`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.text();
}

export async function fetchHealth(): Promise<Record<string, unknown>> {
  const r = await fetch(`${API_BASE}/v1/health`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}

export async function fetchDiagnostics(): Promise<Record<string, unknown>> {
  const r = await fetch(`${API_BASE}/v1/diagnostics`);
  if (!r.ok) throw new Error(`API error ${r.status}`);
  return r.json();
}
