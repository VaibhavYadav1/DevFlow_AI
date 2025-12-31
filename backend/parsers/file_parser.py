from .python_parser import parse_python
from .tree_sitter_parser import parse_tree_sitter
from .helper_function import EXTENSION_LANGUAGE_MAP

def parse_file(file_path: str, ext: str):

    language = EXTENSION_LANGUAGE_MAP[ext]

    try:
        with open(file_path, "r", encoding="utf8", errors="ignore") as f:
            code = f.read()
    except Exception:
        return None

    if language == "python":
        return parse_python(code, file_path)

    return parse_tree_sitter(code, language, file_path)
