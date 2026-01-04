EXTENSION_LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript",
    ".java": "java",
    ".json": "json",
    ".html": "html",
    ".css": "css",
 
    # Dart / Flutter
    ".dart": "dart",
    ".yaml": "yaml",      # pubspec.yaml, analysis_options.yaml
    ".yml": "yaml",
 
    # Platform-specific (Flutter)
    ".kt": "kotlin",      # Android
    ".swift": "swift",    # iOS
    ".gradle": "gradle",
    ".xml": "xml"
}
 
SKIP_LIST = {
    ".git", "node_modules", "venv", ".venv", "__pycache__",
    "dist", "build", "target",
 
    # Flutter / Dart
    ".dart_tool",
    ".idea",
    ".vscode",
    "android/.gradle",
    "android/build",
    "ios/Pods",
    "ios/build",
    "linux/build",
    "macos/build",
    "windows/build"
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