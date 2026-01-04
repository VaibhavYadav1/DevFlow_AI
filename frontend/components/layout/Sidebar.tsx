"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Dashboard", href: "/", icon: "📊" },
    { name: "Upload Project", href: "/upload-file", icon: "📁" },
    { name: "Projects", href: "/projects", icon: "📚" },
    //   { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    DevFlow AI
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-blue-600 shadow-lg shadow-blue-900/50 text-white"
                                : "hover:bg-slate-800 text-slate-300 hover:text-white"
                                }`}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">
                                {item.icon}
                            </span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User / Footer Area */}
            <div className="p-4 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-800/50">
                    <p className="text-xs text-slate-400 text-center">{`DevFlow AI © ${new Date().getFullYear()}`}</p>
                </div>
            </div>
        </aside>
    );
}
