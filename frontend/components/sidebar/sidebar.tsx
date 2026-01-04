"use client"

import { useEffect, useState } from "react";
import SideBarItem from "./sidebar_item";
import {
    LayoutDashboard,
    Folder,
    FileText,
    Share2,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import Link from "next/link"
import { getAllTasks } from "@/api/fileApi";
import { Tasks } from "@/models/Tables";

export default function Sidebar() {

    const [projects, setProjects] = useState<Tasks[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {

            try {
                const data = await getAllTasks();
                setProjects(data);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }

        }

        fetchProjects();

    }, [])

    const [openProjects, setOpenProject] = useState(true);

    return (
        <>

            <aside className="h-screen w-64 border-r bg-white px-4 py-6">

                <nav className="space-y-2 text-sm font-medium">

                    <SideBarItem
                        href="/upload-file"
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                    />

                    <div>
                        <button
                            onClick={() => setOpenProject(!openProjects)}
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            <div className="flex items-center gap-2">
                                <Folder size={18} />
                                <span>Projects</span>
                            </div>
                            {openProjects ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {openProjects && (
                            <ul className="ml-6 mt-2 space-y-1 list-none p-0">
                                {projects.map((project) => (
                                    <li key={project._id}>
                                        <SideBarItem
                                            href={`/upload-file/${project.project_name}/${project.parsed_id}`}
                                            label={project.project_name}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}

                    </div>

                    <SideBarItem
                        href="/upload-file/documentation"
                        icon={<FileText size={18} />}
                        label="Documentation"
                    />

                    <SideBarItem
                        href="/upload-file/diagram"
                        icon={<Share2 size={18} />}
                        label="Diagrams"
                    />
                </nav>
            </aside>
        </>
    )

}
