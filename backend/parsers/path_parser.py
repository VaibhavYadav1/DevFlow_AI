import os
from .helper_function import EXTENSION_LANGUAGE_MAP, SKIP_LIST
from .file_parser import parse_file
from models.parser_model import File

def parse_path(root_path: str):
    filesObj: list[File] = []

    for root, dirs, files in os.walk(root_path):
        
        dirs[:] = [d for d in dirs if d not in SKIP_LIST]

        for file in files:
            full_path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()

            if ext not in EXTENSION_LANGUAGE_MAP:
                continue

            try:
                parsed = parse_file(full_path, ext)
            except Exception as e:
                parsed = {
                    "error": str(e)
                }

            filesObj.append(parsed)

    return filesObj
