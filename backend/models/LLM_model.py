from pydantic import BaseModel

class DocumentModel(BaseModel):
    parsed_id: str
    content: str

class MermaidDiagrams(BaseModel):
    class_diagram: str
    api_flow: str

class DiagramModel(BaseModel):
    parsed_id: str
    content: MermaidDiagrams