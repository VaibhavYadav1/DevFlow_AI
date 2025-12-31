from pydantic import BaseModel
from typing import Optional, List

class Service(BaseModel):
    classes: Optional[List[str]] = None
    functions: Optional[List[str]] = None

class Controller(BaseModel):
    routes: Optional[List[dict]] = None
    functions: Optional[List[str]] = None

class File(BaseModel):
    file_path: str
    language: str
    functions: Optional[List[str]] = None
    classes: Optional[List[str]] = None
    imports: Optional[List[str]] = None
    controller: Optional[Controller] = None
    service: Optional[Service] = None

class ParserModel(BaseModel):
    project_name: str
    root_path: str
    total_files: int
    files: Optional[List[File]] = None