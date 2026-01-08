"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

type MermaidDiagramProps = {
  code: string;
};

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    const renderDiagram = async () => {
      try {
        // 🔥 IMPORTANT: convert escaped newlines to real newlines
        const cleanedCode = code.replace(/\\n/g, "\n").trim();

        const { svg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          cleanedCode
        );

        containerRef.current!.innerHTML = svg;
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    };

    renderDiagram();
  }, [code]);

  return <div ref={containerRef} />;
}

