# utils/file_walker.py
import os
import zipfile
from pathlib import Path
from typing import List, Dict, Optional

DEFAULT_IGNORE_DIRS = {
    ".git","__pycache__","node_modules","dist","build",".next",".venv","venv",".vscode",".idea"
}

DEFAULT_EXTS = {
    ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".rb",
    ".php", ".c", ".cpp", ".cs", ".json", ".md", ".yml", ".yaml"
}

def safe_extract_zip(zip_path: str, dest_folder: str):
    """
    Extract zip safely (prevent path traversal).
    """
    Path(dest_folder).mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as z:
        for member in z.infolist():
            member_name = member.filename
            # skip absolute and parent paths
            if member_name.startswith("/") or ".." in Path(member_name).parts:
                continue
            target = Path(dest_folder) / member_name
            # create parent dirs and write
            if member.is_dir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with z.open(member) as source, open(target, "wb") as dest:
                    dest.write(source.read())