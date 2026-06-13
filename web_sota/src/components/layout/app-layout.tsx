import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { cn } from '@/common/utils';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [collapsed, setCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sidebar-collapsed');
            return stored === 'true';
        }
        return false;
    });

    const handleToggle = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', String(newState));
    };

    return (
        <div className="flex min-h-screen bg-[#050505] text-white selection:bg-cosmos-500/30">
            <Sidebar collapsed={collapsed} onToggle={handleToggle} />
            <div className={cn(
                "flex flex-1 flex-col transition-all duration-300 ease-in-out",
                collapsed ? "ml-16" : "ml-64"
            )}>
                <Topbar />
                <main className="flex-1 p-8 overflow-y-auto scroll-smooth">
                    <div className="max-w-7xl mx-auto page-enter">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
