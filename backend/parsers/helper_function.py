EXTENSION_LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".java": "java",
    ".json": "json",
    ".html": "html",
    ".css": "css"
}

SKIP_LIST = {
    ".git", "node_modules", "venv", ".venv",
    "__pycache__", "dist", "build", "target"
}

def base_result(file_path, language):
    return {
        "file_path": file_path,
        "language": language,

        "functions": [],
        "classes": [],
        "imports": [],

        "controller": {
            "routes": [],
            "functions": []
        },

        "service": {
            "classes": [],
            "functions": []
        }
    }