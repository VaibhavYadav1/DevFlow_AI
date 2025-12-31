"use client";

interface TextInputProps {
    label: string;
    value: string;
    isRequired: boolean;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function TextInput({
    label,
    value,
    isRequired,
    onChange,
    placeholder,
}: TextInputProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
                {label}
            </label>
            <input
                type="text"
                value={value}
                required={isRequired}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring"
            />
        </div>
    );
}
