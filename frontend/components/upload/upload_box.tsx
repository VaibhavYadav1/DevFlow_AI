"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadZip, getStatus } from "@/api/fileApi";
import { setParserID } from "@/store/features/fileSlice";

import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text_input";
import FileUpload from "@/components/ui/file_upload";

export default function UploadBox() {
    const dispatch = useDispatch();

    const [projectName, setProjectName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [taskId, setTaskId] = useState("");

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

        </div>
    );
}
