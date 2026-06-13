import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/common/utils';
import {
    LayoutDashboard,
    Bot,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const location = useLocation();

    const navItems = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/chat', label: 'AI Command', icon: Bot },
        { href: '/missions', label: 'Missions', icon: Zap },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside
            className={cn(
                "glass-sidebar flex flex-col transition-all duration-300 ease-in-out",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cosmos-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-lg gradient-text truncate">Moltbot</span>
                )}
            </div>

            <nav className="flex-1 px-3 space-y-1 mt-4">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "nav-item",
                                isActive && "active",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-cosmos-400")} />
                            {!collapsed && <span>{item.label}</span>}

                            {collapsed && (
                                <div className="absolute left-full ml-4 hidden rounded-lg bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs text-white group-hover:block z-50 whitespace-nowrap shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/[0.06]">
                <button
                    onClick={onToggle}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                    {collapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : <><ChevronLeft className="w-5 h-5" /><span className="text-sm">Collapse</span></>}
                </button>
            </div>
        </aside>
    );
}
