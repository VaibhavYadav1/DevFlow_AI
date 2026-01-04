"use client";

import { getASTCode } from "@/api/fileApi";
import { useEffect, useState } from "react";
import { ASTProject } from "@/models/Tables";

export default function AstCode(
    { parsed_id }: { parsed_id: any }
) {
    const [astObj, setAstObj] = useState<ASTProject | null>(null);
    const [copy, setCopy] = useState("Copy");

    useEffect(() => {
        if (!parsed_id) return;

        const getCode = async () => {
            const res = await getASTCode(parsed_id);
            setAstObj(res);
        };

        getCode();
    }, [parsed_id]);

    const copyToClipboard = () => {
        if (!astObj) return;
        navigator.clipboard.writeText(JSON.stringify(astObj, null, 2));
        setCopy("Copied")
    };


    function getLanguages(files: ASTProject["files"] = []) {
        return [...new Set(files.map((f) => f.language))];
    }

    function countRoutes(files: ASTProject["files"] = []) {
        return files.reduce(
            (count, file) => count + (file.controller?.routes?.length || 0),
            0
        );
    }

    if (!astObj) return null;

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4 space-y-4">
            {/* Summary */}
            <div className="flex flex-wrap gap-6 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div>
                    Parsed Files:{" "}
                    <span className="font-semibold text-slate-900">
                        {astObj.total_files}
                    </span>
                </div>
                <div>
                    Languages Detected:{" "}
                    <span className="font-semibold text-slate-900">
                        {getLanguages(astObj.files).join(", ")}
                    </span>
                </div>
                <div>
                    Routes Found:{" "}
                    <span className="font-semibold text-slate-900">
                        {countRoutes(astObj.files)}
                    </span>
                </div>
            </div>

            {/* Code Container */}
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                {/* Top Bar */}
                <div className="flex justify-end px-3 py-2 bg-slate-800 border-b border-slate-700">
                    <button
                        onClick={copyToClipboard}
                        className="text-xs px-3 py-1 rounded-md bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
                    >
                        {copy}
                    </button>
                </div>

                {/* Code Box */}
                <pre className="max-h-[500px] overflow-auto p-4 text-sm leading-relaxed text-slate-200 font-mono">
                    {JSON.stringify(astObj, null, 2)}
                </pre>
            </div>
        </div>
    );
}

