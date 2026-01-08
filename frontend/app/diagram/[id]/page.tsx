"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDiagram } from "@/api/fileApi";
import { Diagram } from "@/models/Tables";
import MermaidDiagram from "@/components/diagram/mermaid_diagram";

export default function ProjectDocumentation() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [diagram, setDiagram] = useState<Diagram>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getDiagram(id);
        setDiagram(res);
      } catch (error) {
        console.error("Failed to fetch diagrams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Projects
      </button>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full opacity-25"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium animate-pulse">Loading diagrams...</p>
        </div>
      ) : diagram ? (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 p-8">
            <div className="flex items-center gap-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white text-2xl shadow-lg shadow-indigo-600/30">
                🧩
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Project Diagrams
                </h1>
                <p className="text-slate-500">
                  Auto-generated architecture visuals
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10 space-y-14">
            {/* API Flow */}
            {diagram.content.api_flow && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                  🔗 API Flow Diagram
                </h2>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 overflow-auto">
                  <MermaidDiagram code={diagram.content.api_flow} />
                </div>
              </section>
            )}

            {/* Class Diagram */}
            {diagram.content.class_diagram && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-2">
                  🏗️ Class Diagram
                </h2>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 overflow-auto">
                  <MermaidDiagram code={diagram.content.class_diagram} />
                </div>
              </section>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-slate-800">
            Diagrams Not Found
          </h3>
          <p className="text-slate-500 mt-2">
            We could not retrieve diagrams for this project.
          </p>
        </div>
      )}
    </div>
  );
}
    