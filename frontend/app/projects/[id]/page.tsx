"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDocumentation } from "@/api/fileApi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ProjectDocumentation() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await getDocumentation(id);
                if (res && res.content) {
                    setContent(res.content);
                }
            } catch (error) {
                console.error("Failed to fetch documentation:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div className="max-w-5xl mx-auto p-8">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Projects
            </button>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <div className="relative w-16 h-16 mb-6">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-25"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium animate-pulse">Loading documentation...</p>
                </div>
            ) : content ? (
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-8">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white text-2xl shadow-lg shadow-blue-600/30">
                                📊
                            </span>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Project Documentation</h1>
                                <p className="text-slate-500">Generated Analysis and Insights</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10">
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
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </article>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-medium text-slate-800">Documentation Not Found</h3>
                    <p className="text-slate-500 mt-2">We could not retrieve the documentation for this project.</p>
                </div>
            )}
        </div>
    );
}
