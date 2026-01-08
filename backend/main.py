from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException, Request, Form
from fastapi.responses import FileResponse
from uuid import uuid4
import os
import aiofiles
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from utils.file_walker import safe_extract_zip
from utils.doc_generator import generate_project_documents
from db import (
    get_tasks,
    insert_task_record,
    update_task_status,
    insert_parsed_record,
    get_task,
    get_parsed_data,
    save_docs_summary,
    save_diagram_summary
)
from models.task_model import TaskModel
from models.parser_model import ParserModel
from models.LLM_model import DocumentModel, DiagramModel
from parsers.path_parser import parse_path

load_dotenv()

MONGO_URL = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        mongodb_client = AsyncIOMotorClient(
            MONGO_URL
        )

        db = mongodb_client[DB_NAME]
        app.mongodb_client = mongodb_client
        app.mongodb = db

        print("✅ MongoDB client created")

        yield

    finally:
        mongodb_client.close()
        print("🔌 MongoDB disconnected")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/all-project")
async def get_all_tasks():
    return await get_tasks(app)

async def _bg_parse_repo(app, task_id, project_name, zip_path):
    try:
        extract_path = zip_path.replace(".zip", "")
        safe_extract_zip(zip_path, extract_path)

        await update_task_status(app, task_id, {
            "progress": 15,
            "status": "progress"
        })

        file_models, parse_errors = parse_path(extract_path)

        parsed_model = ParserModel(
            project_name=project_name,
            root_path=extract_path,
            total_files=len(file_models),
            files=file_models
        )

        parsed_id = await insert_parsed_record(app, parsed_model.model_dump())

        await update_task_status(app, task_id, {
            "progress": 100,
            "status": "completed",
            "parsed_id": parsed_id
        })

        # --- Generate Documentation & Diagrams ---
        try:
            # 1. Fetch/Generate Summary
            summary_data = await save_docs_summary(app, parsed_id)
            summary_content = summary_data.get("content", "")

            # 2. Fetch/Generate Diagrams
            diagram_data = await save_diagram_summary(app, parsed_id)
            diagram_content = diagram_data.get("content", {})

            # 3. Generate Files
            # extract_path is like "upload/project_name/file_extracted" or just "upload/project_name" depending on zip structure.
            # But the requirement says "whenever a zip file is uploaded".
            # The zip_path is "upload/project_name/filename.zip". 
            # So let's save the docs in "upload/project_name/" (which is `os.path.dirname(zip_path)`).
            output_dir = os.path.dirname(zip_path)
            
            # Run in a threadpool since it involves blocking IO (pdf/docx gen)
            generate_project_documents(summary_content, diagram_content, output_dir)
            
        except Exception as doc_err:
            print(f"⚠️ Error generating project documents: {doc_err}")


    except Exception as e:
        await update_task_status(app, task_id, {
            "status": "failed",
            "error_message": str(e)
        })
        
@app.post("/upload-zip")
async def upload_zip_file(
    request: Request,
    background_task: BackgroundTasks,
    file: UploadFile = File(...),
    project_name: str | None = Form(None)   # 👈 from FormData
) -> None:

    filename = file.filename

    if not filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Only .zip files accepted")

    if project_name is None:
        project_name = f"project-{uuid4().hex[:8]}"

    save_dir = os.path.join("upload", project_name)
    os.makedirs(save_dir, exist_ok=True)

    zip_path = os.path.join(save_dir, filename)

    # save zip file to local storage
    async with aiofiles.open(zip_path, "wb") as out:
        content = await file.read()
        await out.write(content)

    task_json = {
        "project_name": project_name,
        "progress": 0,
        "status": "pending"
    }

    task_id = await insert_task_record(app, task_json)

    background_task.add_task(
        _bg_parse_repo,
        app,
        task_id,
        project_name,
        zip_path
    )

    return {
        "message": "accepted",
        "project_name": project_name,
        "task_id": task_id
    }

@app.get("/health/db")
async def db_health():
    try:
        await app.mongodb.command("ping")
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@app.get("/tasks/{task_id}", response_model=TaskModel)
async def get_task_status(task_id: str):
    task = await get_task(app, task_id)
    return task

@app.get("/ast_parser/{parser_id}", response_model=ParserModel)
async def get_ast(parser_id: str):
    ast_doc = await get_parsed_data(app, parser_id)
    return ast_doc

@app.get("/get_documentation/{parsed_id}", response_model=DocumentModel)
async def getDocumentation(parsed_id: str):
    return await save_docs_summary(app, parsed_id)


@app.get("/get_diagram/{parsed_id}", response_model=DiagramModel)
async def getDiagram(parsed_id: str):
    
    return await save_diagram_summary(app, parsed_id)

@app.get("/download/{parsed_id}")
async def download_file(parsed_id: str):
    # 1. Get project info
    parsed_record = await get_parsed_data(app, parsed_id)
    if not parsed_record:
        raise HTTPException(status_code=404, detail="Project not found")

    project_name = parsed_record.get("project_name")
    if not project_name:
        raise HTTPException(status_code=404, detail="Project Name not found")

    # 2. Construct path
    # Assuming files are in upload/{project_name}/project_summary.pdf
    # Ideally should use root_path but let's stick to convention used in upload
    pdf_path = os.path.join("upload", project_name, "project_summary.pdf")
    
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Summary file not generated yet")

    return FileResponse(pdf_path, media_type="application/pdf", filename=f"{project_name}_summary.pdf")


@app.get("/download_docx/{parsed_id}")
async def download_docx_file(parsed_id: str):
    # 1. Get project info
    parsed_record = await get_parsed_data(app, parsed_id)
    if not parsed_record:
        raise HTTPException(status_code=404, detail="Project not found")

    project_name = parsed_record.get("project_name")
    if not project_name:
        raise HTTPException(status_code=404, detail="Project Name not found")

    # 2. Construct path
    docx_path = os.path.join("upload", project_name, "project_summary.docx")
    
    if not os.path.exists(docx_path):
        raise HTTPException(status_code=404, detail="Summary file not generated yet")

    return FileResponse(docx_path, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename=f"{project_name}_summary.docx")



@app.get("/projects")
async def list_projects():
    from db import get_all_projects
    return await get_all_projects(app)