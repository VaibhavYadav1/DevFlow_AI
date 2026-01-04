"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDocumentation } from "@/api/fileApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RootState } from "@/store/store";

export default function ProjectSummary() {
    const parserId = useSelector((state: RootState) => state.file.parsed_id);
    const [summary, setSummary] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!parserId) return;

        const fetchSummary = async () => {
            setLoading(true);
            try {
                const res = await getDocumentation(parserId);
                if (res && res.content) {
                    setSummary(res.content);
                    setIsExpanded(true); // Auto-expand when loaded
                }
            } catch (error) {
                console.error("Failed to fetch summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [parserId]);

    if (!parserId) return null;

    return (
        <div className="mx-auto mt-12 mb-8 px-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
                {/* Header / Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-full flex items-center justify-between p-8 transition-colors duration-300 ${isExpanded
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white hover:bg-slate-50 text-slate-800"
                        }`}
                    disabled={loading}
                >
                    <div className="flex items-center gap-4">
                        <span className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl shadow-sm ${isExpanded ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                            }`}>
                            📊
                        </span>
                        <div className="text-left">
                            <h2 className={`text-2xl font-bold ${isExpanded ? "text-white" : "text-slate-800"}`}>
                                Project Analysis
                            </h2>
                            <p className={`text-sm ${isExpanded ? "text-blue-100" : "text-slate-500"}`}>
                                Comprehensive overview of your codebase
                            </p>
                        </div>
                    </div>

                    <div
                        className={`p-3 rounded-full transition-all duration-500 ${isExpanded
                            ? "bg-white/20 text-white rotate-180"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </div>
                </button>

                {/* Content Area */}
                <div
                    className={`transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="p-10 bg-slate-50/50">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <div className="relative w-16 h-16 mb-6">
                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-25"></div>
                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                </div>
                                <p className="text-lg font-medium animate-pulse">Generating insights...</p>
                            </div>
                        ) : summary ? (
                            <article className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-800
                prose-h1:text-4xl prose-h1:mb-8 prose-h1:text-blue-600
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
                prose-h3:text-xl prose-h3:text-indigo-600
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-li:text-slate-600
                prose-strong:text-slate-800 prose-strong:font-bold
                prose-code:bg-slate-100 prose-code:text-indigo-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:shadow-lg prose-pre:rounded-xl
                prose-table:w-full prose-table:text-left prose-table:border-collapse
                prose-th:bg-blue-50 prose-th:p-4 prose-th:text-slate-700 prose-th:font-semibold prose-th:border prose-th:border-slate-200
                prose-td:p-4 prose-td:border prose-td:border-slate-200 prose-td:text-slate-600
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700
                bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mx-auto">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                            </article>
                        ) : (
                            <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="text-6xl mb-4">📝</div>
                                <p className="text-lg font-medium">No summary available yet.</p>
                                <p className="text-sm">Upload a project to generate an analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
