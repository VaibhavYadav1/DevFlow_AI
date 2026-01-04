"use client"

import { getDiagram } from "@/api/fileApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Diagram } from "@/models/Tables";
import MermaidDiagram from "@/components/diagram/mermaid_diagram";

export default function diagram() {

    const parsed_id = useSelector((state: any) => state.parsed_id);
    const [diagram, setDiagram] = useState<Diagram>();

    useEffect(() => {

        const fetchData = async () => {

            try {
                const response = await getDiagram(parsed_id);
                setDiagram(response);
            } catch (error) {
                console.error(error)
            }

        }

        fetchData();

    }, [parsed_id])

    return(
        <>
            {diagram?.content.class_diagram && <MermaidDiagram code={diagram.content.class_diagram} />}
        </>
    )

}