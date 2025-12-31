"use client";

interface FileUploadProps {
    file: File | null;
    onFileSelect: (file: File) => void;
}

export default function FileUpload({ file, onFileSelect }: FileUploadProps) {
    return (
        <div className="border-2 border-dashed rounded-lg p-8 text-center mb-6">
            <p className="text-gray-600 mb-2">
                Drag & drop your ZIP file here
            </p>
            <p className="text-gray-400 text-sm mb-4">or</p>

            <label className="inline-block cursor-pointer bg-gray-900 text-white px-4 py-2 rounded-md">
                Browse File
                <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            onFileSelect(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />
            </label>

            {file && (
                <p className="mt-4 text-sm text-gray-700">
                    📄 {file.name}
                </p>
            )}
        </div>
    );
}
