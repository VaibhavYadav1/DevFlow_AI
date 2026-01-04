from bson import ObjectId
from fastapi import HTTPException
import json

from llm.prompts import project_summary_prompt, mermaid_prompt
from llm.client import call_llm

async def get_tasks(app):
    result = app.mongodb.tasks.find()

    tasks = []

    async for task in result:
        task["_id"] = str(task["_id"])
        tasks.append(task)

    return tasks

async def insert_task_record(app, task_data: dict) -> str:
    result = await app.mongodb.tasks.insert_one(task_data)

    print("INSERTING INTO:", app.mongodb.tasks.full_name)
    print("TASK JSON:", task_data)

    return str(result.inserted_id)

async def update_task_status(app, task_id: str, update_data: dict):
    result = await app.mongodb.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
async def get_task(app, task_id: str) -> dict:
    task = await app.mongodb.tasks.find_one(
        {"_id": ObjectId(task_id)}
    )

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task["_id"] = str(task["_id"])
    return task

async def insert_parsed_record(app, parsed_data: dict) -> str:
    result = await app.mongodb.parsed_results.insert_one(parsed_data)
    return str(result.inserted_id)

async def get_parsed_data(app, parsed_id: str):
    doc = await app.mongodb.parsed_results.find_one({"_id": ObjectId(parsed_id)})

    if not doc:
        return None

    doc["_id"] = str(doc["_id"])
    return doc

async def save_docs_summary(app, parsed_id):

    getASTData = await get_parsed_data(app, parsed_id)

    # Project summary
    project_prompt = project_summary_prompt(getASTData)
    
    project_doc = call_llm(project_prompt)

    if not isinstance(project_doc, str):
        project_doc = str(project_doc)

    docs = {
        "parsed_id": str(parsed_id),
        "content": project_doc
    }

    await app.mongodb.documentation.insert_one(docs)

    return docs

async def save_diagram_summary(app, parsed_id):

    getASTData = await get_parsed_data(app, parsed_id)
    
    # Project summary
    project_prompt = mermaid_prompt(getASTData)

    llm_output = call_llm(project_prompt)

    diagram_json = json.loads(llm_output)

    docs = {
        "parsed_id": str(parsed_id),
        "content": diagram_json
    }

    await app.mongodb.diagram.insert_one(docs)

    return docs