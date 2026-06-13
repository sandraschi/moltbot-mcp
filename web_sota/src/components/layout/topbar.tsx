'use client';

import { APPS_CATALOG } from '@/common/apps-catalog';
import { LayoutGrid, ExternalLink, Bell, Search, User } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Topbar() {
    return (
        <header className="h-16 border-b border-white/[0.06] bg-black/20 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative group max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cosmos-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search fleet commands..."
                        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-cosmos-500/50 focus:bg-white/[0.08] transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* System Status Indicator */}
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-500 border border-emerald-500/20">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    </span>
                    Fleet Node Online
                </div>

                {/* Global Apps Navigation */}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button
                            className="p-2 rounded-full hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all"
                            title="Global Fleet Navigation"
                        >
                            <LayoutGrid className="h-5 w-5" />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            className="z-50 min-w-[220px] animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl p-1 shadow-2xl"
                            sideOffset={8}
                            align="end"
                        >
                            <DropdownMenu.Label className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                SOTA Fleet Hub
                            </DropdownMenu.Label>

                            <div className="h-px bg-white/10 my-1 mx-1" />

                            {APPS_CATALOG.map((app) => (
                                <DropdownMenu.Item key={app.id} asChild>
                                    <a
                                        href={app.url}
                                        className="flex w-full select-none items-center rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white focus:bg-white/[0.08] focus:text-white outline-none cursor-pointer transition-colors"
                                    >
                                        <app.icon className="mr-3 h-4 w-4 text-slate-400" />
                                        <span>{app.label}</span>
                                        <ExternalLink className="ml-auto h-3 w-3 opacity-30" />
                                    </a>
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <button
                    className="p-2 rounded-full hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all relative"
                    title="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-cosmos-500 rounded-full border border-black"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/[0.06]">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-white">Sandra Schipal</p>
                        <p className="text-[10px] text-slate-500">Fleet Commander</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/[0.1] flex items-center justify-center overflow-hidden">
                        <User className="w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}

