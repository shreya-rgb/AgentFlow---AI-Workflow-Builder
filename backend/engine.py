"""Workflow execution engine — topological sort + sequential execution."""
from typing import AsyncGenerator
import json
from models import WorkflowNode, WorkflowEdge, ExecutionStatus
from agents import run_agent


def topological_sort(nodes: list[WorkflowNode], edges: list[WorkflowEdge]) -> list[WorkflowNode]:
    """Sort nodes in execution order using Kahn's algorithm."""
    node_map = {n.id: n for n in nodes}
    in_degree = {n.id: 0 for n in nodes}
    adjacency = {n.id: [] for n in nodes}

    for edge in edges:
        if edge.source in adjacency and edge.target in in_degree:
            adjacency[edge.source].append(edge.target)
            in_degree[edge.target] += 1

    # Start with nodes that have no incoming edges
    queue = [nid for nid, deg in in_degree.items() if deg == 0]
    sorted_ids = []

    while queue:
        current = queue.pop(0)
        sorted_ids.append(current)
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we couldn't sort all nodes, there's a cycle — just return original order
    if len(sorted_ids) != len(nodes):
        return nodes

    return [node_map[nid] for nid in sorted_ids if nid in node_map]


def get_previous_output(node_id: str, edges: list[WorkflowEdge], results: dict[str, str]) -> str | None:
    """Get the output from the node that feeds into this node."""
    for edge in edges:
        if edge.target == node_id and edge.source in results:
            return results[edge.source]
    return None


def sse_event(data: dict) -> str:
    """Format a Server-Sent Event."""
    return f"data: {json.dumps(data)}\n\n"


async def execute_workflow(
    nodes: list[WorkflowNode],
    edges: list[WorkflowEdge],
) -> AsyncGenerator[str, None]:
    """Execute the workflow and yield SSE events for each step."""

    if not nodes:
        yield sse_event({"type": "error", "message": "No nodes in workflow"})
        return

    # Sort nodes in execution order
    sorted_nodes = topological_sort(nodes, edges)

    yield sse_event({
        "type": "start",
        "message": f"Starting workflow with {len(sorted_nodes)} nodes...",
        "total": len(sorted_nodes),
    })

    results: dict[str, str] = {}
    final_output = None

    for i, node in enumerate(sorted_nodes):
        node_label = node.data.label
        node_type = node.data.nodeType

        # Signal node is running
        yield sse_event({
            "type": "node_start",
            "node_id": node.id,
            "node_label": node_label,
            "node_type": node_type,
            "index": i,
            "status": ExecutionStatus.RUNNING,
        })

        try:
            previous_output = get_previous_output(node.id, edges, results)
            output = await run_agent(node_type, node.data, previous_output)
            results[node.id] = output
            final_output = output

            yield sse_event({
                "type": "node_done",
                "node_id": node.id,
                "node_label": node_label,
                "node_type": node_type,
                "index": i,
                "status": ExecutionStatus.DONE,
                "output": output,
            })

        except Exception as e:
            error_msg = str(e)
            yield sse_event({
                "type": "node_error",
                "node_id": node.id,
                "node_label": node_label,
                "node_type": node_type,
                "index": i,
                "status": ExecutionStatus.ERROR,
                "error": error_msg,
            })
            # Continue with remaining nodes even if one fails
            results[node.id] = f"[Error: {error_msg}]"

    yield sse_event({
        "type": "complete",
        "message": "Workflow execution complete!",
        "final_output": final_output,
    })
