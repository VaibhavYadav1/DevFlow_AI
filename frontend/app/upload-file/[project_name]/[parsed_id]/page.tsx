"use client";

import AstCode from "@/components/ast/ast_code";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const { parsed_id } = useParams();

  return (
    <div>
      <AstCode parsed_id={parsed_id} />
    </div>
  );
}
