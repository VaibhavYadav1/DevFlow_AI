"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

type MermaidDiagramProps = {
  code: string;
};

export default function MermaidDiagram({ code }: MermaidDiagramProps) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    mermaid.run();
  }, [code]);

  return (
    <div
      className="mermaid"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
