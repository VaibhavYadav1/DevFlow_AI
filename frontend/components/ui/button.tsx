"use client";

interface ButtonProps {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
}

export default function Button({
    label,
    onClick,
    disabled = false,
    loading = false,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`w-full py-3 rounded-md text-white font-medium transition
        ${disabled || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
      `}
        >
            {loading ? "Please wait..." : label}
        </button>
    );
}