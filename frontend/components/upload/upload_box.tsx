"use client";

import { createElement } from "react";
import { BASE_URL } from "@/api/config";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadZip, getStatus } from "@/api/fileApi";
import { setParserID } from "@/store/features/fileSlice";

import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text_input";
import FileUpload from "@/components/ui/file_upload";
import AstCode from "../ast/ast_code";

export default function UploadBox() {
    const dispatch = useDispatch();

    const [projectName, setProjectName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [taskId, setTaskId] = useState("");
    const [parserId, setParserId] = useState();

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const res = await uploadZip(projectName, file);

            setTaskId(res.task_id);

            setMessage("⏳ Your Zip File Uploaded and analyzing your project…")
        } catch (err) {
            setMessage("Upload failed " + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!taskId)
            return

        // eslint-disable-next-line prefer-const
        let intervalId: NodeJS.Timeout;

        const pollStatus = async () => {
            try {
                const res = await getStatus(taskId);

                if (res.parsed_id) {

                    setParserId(res.parsed_id)

                    dispatch(setParserID(res.parsed_id));
                    setMessage("✅ File uploaded successfully. Go to the Documentation tab or Diagrams tab to view the generated output.");

                    clearInterval(intervalId);

                }

            } catch (err) {
                setMessage("Parsing failed " + err);
            }
        };

        intervalId = setInterval(pollStatus, 2000);

        return () => clearInterval(intervalId)

    }, [taskId])

    return (
        <div className="mx-auto mt-10 p-6">
            <h1 className="text-2xl font-semibold mb-6">
                📦 Upload Project
            </h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleUpload();
                }}>

                <TextInput
                    label="Project Name"
                    value={projectName}
                    isRequired={true}
                    placeholder="Enter you project name"
                    onChange={setProjectName}
                />

                <FileUpload file={file} onFileSelect={setFile} />

                <Button
                    label="Upload & Parse Project"
                    disabled={!file}
                    loading={loading}
                />
            </form>

            {message && (
                <p className="mt-4 text-blue-600">
                    {message}
                </p>
            )}

            {parserId && (
                <div className="mt-4 flex justify-center gap-4">

                    <a
                        href={`${BASE_URL}/download/${parserId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        📄 Download PDF
                    </a>

                    <a
                        href={`${BASE_URL}/download_docx/${parserId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        📝 Download DOCX
                    </a>
                </div>
            )}


            {parserId && <AstCode parsed_id={parserId} />}

        </div>
    );
}
