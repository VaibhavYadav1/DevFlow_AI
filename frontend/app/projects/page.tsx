"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "@/api/fileApi";

interface Project {
    _id: string;
    project_name: string;
    total_files: number;
    root_path: string;
}

export default function DocumentationPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Projects Hub
                </h1>
                <p className="text-slate-500 text-lg">
                    Browse and explore documentation and diagrams for all uploaded projects
                </p>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-4xl mb-4">📂</div>
                    <h3 className="text-xl font-medium text-slate-800">No projects found</h3>
                    <p className="text-slate-500 mt-2">Upload a project to get started.</p>
                    <Link
                        href="/upload-file"
                        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Upload Project
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 border border-slate-100 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                    ID: {project._id.slice(-6)}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2 truncate" title={project.project_name}>
                                {project.project_name}
                            </h3>

                            <div className="space-y-2 mb-6">
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <span className="w-4 h-4">📄</span>
                                    {project.total_files} Files Processed
                                </p>
                                <p className="text-sm text-slate-500 flex items-center gap-2 truncate" title={project.root_path}>
                                    <span className="w-4 h-4">📍</span>
                                    {project.root_path}
                                </p>
                            </div>

                            <Link
                                href={`/projects/${project._id}`}
                                className="block w-full py-3 px-4 bg-slate-50 text-slate-600 text-center font-medium rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300"
                            >
                                View Documentation
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
