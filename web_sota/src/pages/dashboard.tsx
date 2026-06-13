import { useEffect, useState } from "react";
import { Activity, Cpu, Zap, ArrowRight, Server, Wifi, WifiOff } from "lucide-react";

export function Dashboard() {
    const [health, setHealth] = useState<{ status: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [logCount, setLogCount] = useState(0);

    useEffect(() => {
        fetch("/api/health").then(r => r.json()).then(d => setHealth(d)).catch(e => setError(String(e)));
        fetch("/api/logs/stats").then(r => r.json()).then(d => setLogCount(d.total || 0)).catch(() => {});
    }, []);

    const connected = health?.status === "ok";
    const stats = [
        { title: 'Backend', value: connected ? 'Online' : 'Offline', change: connected ? 'Connected' : 'Error', icon: connected ? Wifi : WifiOff, color: connected ? 'text-emerald-400' : 'text-red-400' },
        { title: 'Log Entries', value: String(logCount), change: 'Ring buffer', icon: Activity, color: 'text-blue-400' },
        { title: 'API Bridge', value: connected ? 'Active' : 'Down', change: 'FastMCP', icon: Server, color: connected ? 'text-purple-400' : 'text-red-400' },
        { title: 'Status', value: error ? 'Error' : 'Healthy', change: error ? error : 'All nominal', icon: Zap, color: error ? 'text-red-400' : 'text-amber-400' },
    ];

    return (
        <div className="space-y-8 page-enter">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text tracking-tight uppercase">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Moltbot node — {connected ? 'operating within nominal parameters' : 'connection issue detected'}.</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${connected ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                    {connected ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="glass-card p-6 group hover:border-white/20 transition-all cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-xl bg-white/[0.03] ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.change}</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-white mt-1 uppercase tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Logs */}
                <div className="lg:col-span-2 glass-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                        <h3 className="font-bold text-sm tracking-widest uppercase">System Activity</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Stream</span>
                        </div>
                    </div>
                    <div className="p-6 font-mono text-xs space-y-2 bg-black/40">
                        <p className="text-blue-400/80">[08:42:12] [system] Daemon connection initialized: moltbott-v3</p>
                        <p className="text-slate-500">[08:42:12] [network] API endpoints reachable: 10731 port bound</p>
                        <p className="text-emerald-400/80">[08:42:13] [success] FastMCP Server active and federated</p>
                        <p className="text-purple-400/80">[08:45:01] [arazzo] Loaded workflow: cleanup_fleet_stragglers</p>
                        <p className="text-slate-300 animate-pulse">_</p>
                    </div>
                </div>

                {/* Node Status */}
                <div className="glass-card p-6 space-y-6">
                    <h3 className="font-bold text-sm tracking-widest uppercase mb-4">Node Health</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Bridge Connection', status: 'Healthy', color: 'bg-emerald-500' },
                            { name: 'Arazzo Engine', status: 'Standby', color: 'bg-emerald-500' },
                            { name: 'SEP-1577 Sampler', status: 'Ready', color: 'bg-emerald-500' },
                            { name: 'Auth Middleware', status: 'Active', color: 'bg-cosmos-500' },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-white uppercase">{item.status}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-bold uppercase tracking-widest transition-all">
                        Run Diagnostics <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

