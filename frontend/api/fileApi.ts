import { BASE_URL } from "./config"

export async function uploadZip(projectName: string, file: File) {
    const formData = new FormData();
    formData.append("project_name", projectName)
    formData.append("file", file);

    const res = await fetch(`${BASE_URL}/upload-zip`, {
        method: "Post",
        body: formData
    });

    return res.json();
}

export async function getStatus(taskId: string) {

    const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: "Get",
    })

    return res.json();

}

export async function getDocumentation(parsedId: string) {

    const res = await fetch(`${BASE_URL}/get_documentation/${parsedId}`, {
        method: "Get",
    })

    return res.json();

}

export async function getDiagram(parsedId: string) {

    const res = await fetch(`${BASE_URL}/get_diagram/${parsedId}`, {
        method: "Get",
    })

    return res.json();

}