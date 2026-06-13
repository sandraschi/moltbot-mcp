import { Zap, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export function Missions() {
    const missions = [
        {
            id: 'cleanup-fleet',
            name: 'Fleet Straggler Cleanup',
            description: 'Identifies and modernizes legacy MCP nodes to SOTA standards.',
            steps: 5,
            status: 'Ready',
            type: 'System',
            priority: 'High'
        },
        {
            id: 'security-audit',
            name: 'Global Security Audit',
            description: 'Verifies SOTA Auth Middleware integration across all fleet nodes.',
            steps: 12,
            status: 'Pending',
            type: 'Security',
            priority: 'Critical'
        },
        {
            id: 'performance-sync',
            name: 'Fleet Performance Sync',
            description: 'Optimizes resource allocation and port blocking across the grid.',
            steps: 8,
            status: 'Ready',
            type: 'Operational',
            priority: 'Medium'
        }
    ];

    return (
        <div className="space-y-8 page-enter">
            <div>
                <h1 className="text-3xl font-bold gradient-text tracking-tight uppercase">Missions</h1>
                <p className="text-slate-500 mt-1">Orchestrate multi-step Arazzo workflows across the SOTA fleet.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {missions.map((mission) => (
                    <div key={mission.id} className="glass-card group overflow-hidden">
                        <div className="flex items-center p-6 gap-6">
                            <div className="p-4 rounded-2xl bg-white/[0.03] text-amber-400 border border-white/[0.06]">
                                <Zap className="w-8 h-8" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{mission.name}</h3>
                                    <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {mission.type}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">{mission.description}</p>
                            </div>

                            <div className="text-right flex flex-col items-end gap-2 pr-4 border-r border-white/[0.06]">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${mission.status === 'Ready' ? 'text-emerald-400' : 'text-amber-400'
                                    }`}>
                                    Status: {mission.status}
                                </span>
                                <div className="flex items-center gap-1 text-slate-500 text-xs">
                                    <Clock className="w-3 h-3" />
                                    <span>{mission.steps} Steps</span>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cosmos-600 hover:bg-cosmos-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-cosmos-500/20 group-hover:scale-105 active:scale-95">
                                <Play className="w-4 h-4 fill-current" />
                                Launch
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mission History */}
            <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="font-bold text-sm tracking-widest uppercase">Execution History</h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                    {[
                        { name: 'Bridge Sync', result: 'Success', time: '14 mins ago' },
                        { name: 'Status Check', result: 'Success', time: '1h ago' },
                        { name: 'Handbrake Transcode', result: 'Failed', time: '3h ago' },
                    ].map((item, i) => (
                        <div key={i} className="px-6 py-4 hover:bg-white/[0.02] transition-colors flex items-center gap-4 text-xs">
                            {item.result === 'Success' ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-500" />
                            )}
                            <div className="flex-1 font-semibold text-slate-300 uppercase letter-spacing-wider">{item.name}</div>
                            <div className="text-slate-500">{item.time}</div>
                            <div className={`font-bold uppercase tracking-widest ${item.result === 'Success' ? 'text-emerald-500/50' : 'text-rose-500/50'
                                }`}>{item.result}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
