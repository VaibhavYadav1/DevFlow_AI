"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex w-full">
            <Sidebar />
            <main className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
