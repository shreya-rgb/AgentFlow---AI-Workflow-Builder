"""FastAPI backend for AI Agent Workflow Builder."""
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from models import WorkflowRequest, WorkflowSave
from engine import execute_workflow
from database import init_db, save_workflow, update_workflow, get_all_workflows, get_workflow, delete_workflow


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="AI Agent Workflow Builder", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Execution ────────────────────────────────────────────────────────────────

@app.post("/execute")
async def execute(workflow: WorkflowRequest):
    """Execute a workflow and stream results via SSE."""

    async def event_stream():
        async for event in execute_workflow(workflow.nodes, workflow.edges):
            yield event

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


# ─── Workflows CRUD ───────────────────────────────────────────────────────────

@app.get("/workflows")
async def list_workflows():
    """List all saved workflows."""
    workflows = await get_all_workflows()
    return {"workflows": workflows}


@app.post("/workflows")
async def create_workflow(workflow: WorkflowSave):
    """Save a new workflow."""
    workflow_id = await save_workflow(workflow.title, workflow.nodes, workflow.edges)
    return {"id": workflow_id, "message": "Workflow saved successfully"}


@app.put("/workflows/{workflow_id}")
async def update_workflow_route(workflow_id: int, workflow: WorkflowSave):
    """Update an existing workflow."""
    existing = await get_workflow(workflow_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Workflow not found")
    await update_workflow(workflow_id, workflow.title, workflow.nodes, workflow.edges)
    return {"message": "Workflow updated successfully"}


@app.get("/workflows/{workflow_id}")
async def get_workflow_route(workflow_id: int):
    """Get a specific workflow."""
    workflow = await get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@app.delete("/workflows/{workflow_id}")
async def delete_workflow_route(workflow_id: int):
    """Delete a workflow."""
    existing = await get_workflow(workflow_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Workflow not found")
    await delete_workflow(workflow_id)
    return {"message": "Workflow deleted successfully"}


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    mock_mode = os.getenv("MOCK_MODE", "false").lower() == "true"
    api_key = os.getenv("OPENAI_API_KEY", "")
    has_api_key = bool(api_key) and api_key != "your_openai_api_key_here"
    return {
        "status": "ok",
        "mock_mode": mock_mode,
        "has_api_key": has_api_key,
        "mode": "mock" if (mock_mode or not has_api_key) else "live",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
