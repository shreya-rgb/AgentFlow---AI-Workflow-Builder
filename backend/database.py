"""SQLite database setup for saving/loading workflows."""
import aiosqlite
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "workflows.db")


async def init_db():
    """Initialize the database and create tables."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS workflows (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                nodes TEXT NOT NULL,
                edges TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.commit()


async def save_workflow(title: str, nodes: list, edges: list) -> int:
    """Save a workflow and return its ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            "INSERT INTO workflows (title, nodes, edges) VALUES (?, ?, ?)",
            (title, json.dumps(nodes), json.dumps(edges)),
        )
        await db.commit()
        return cursor.lastrowid


async def update_workflow(workflow_id: int, title: str, nodes: list, edges: list) -> bool:
    """Update an existing workflow."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """UPDATE workflows 
               SET title = ?, nodes = ?, edges = ?, updated_at = CURRENT_TIMESTAMP 
               WHERE id = ?""",
            (title, json.dumps(nodes), json.dumps(edges), workflow_id),
        )
        await db.commit()
        return True


async def get_all_workflows() -> list[dict]:
    """Get all saved workflows (metadata only)."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id, title, created_at, updated_at FROM workflows ORDER BY updated_at DESC"
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]


async def get_workflow(workflow_id: int) -> dict | None:
    """Get a specific workflow by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT * FROM workflows WHERE id = ?", (workflow_id,)
        ) as cursor:
            row = await cursor.fetchone()
            if row:
                data = dict(row)
                data["nodes"] = json.loads(data["nodes"])
                data["edges"] = json.loads(data["edges"])
                return data
            return None


async def delete_workflow(workflow_id: int) -> bool:
    """Delete a workflow by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("DELETE FROM workflows WHERE id = ?", (workflow_id,))
        await db.commit()
        return True
