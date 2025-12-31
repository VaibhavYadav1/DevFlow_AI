from pydantic import BaseModel
from typing import Optional

class TaskModel(BaseModel):
    project_name: str
    progress: int
    status: str
    error_message: Optional[str] = None
    parsed_id: Optional[str] = None