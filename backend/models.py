from pydantic import BaseModel
from typing import Any, Optional
from enum import Enum


class NodeType(str, Enum):
    INPUT = "input"
    WEB_SEARCHER = "web_searcher"
    WRITER = "writer"
    SUMMARIZER = "summarizer"
    CODE_GENERATOR = "code_generator"
    TRANSFORMER = "transformer"
    OUTPUT = "output"


class NodeData(BaseModel):
    label: str
    nodeType: NodeType
    prompt: Optional[str] = None
    inputText: Optional[str] = None
    model: Optional[str] = "gpt-4o-mini"
    temperature: Optional[float] = 0.7
    language: Optional[str] = None  # for code generator


class NodePosition(BaseModel):
    x: float
    y: float


class WorkflowNode(BaseModel):
    id: str
    type: str
    position: NodePosition
    data: NodeData


class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class WorkflowRequest(BaseModel):
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]


class WorkflowSave(BaseModel):
    title: str
    nodes: list[dict]
    edges: list[dict]


class ExecutionStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    ERROR = "error"


class NodeResult(BaseModel):
    node_id: str
    node_label: str
    status: ExecutionStatus
    output: Optional[str] = None
    error: Optional[str] = None
