from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
from datetime import datetime
import os

app = FastAPI(title="Sample FastAPI with UI", version="1.0.0")

# Mount static files
static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_path), name="static")


# Pydantic models
class Task(BaseModel):
    id: int
    title: str
    description: str
    completed: bool = False
    created_at: str


class TaskCreate(BaseModel):
    title: str
    description: str


# In-memory storage for tasks
tasks_db: List[Task] = [
    Task(
        id=1,
        title="Learn FastAPI",
        description="Master the FastAPI framework",
        completed=False,
        created_at=datetime.now().isoformat(),
    ),
    Task(
        id=2,
        title="Build UI",
        description="Create a beautiful frontend interface",
        completed=False,
        created_at=datetime.now().isoformat(),
    ),
]


@app.get("/")
async def root():
    """Serve the main HTML page"""
    return FileResponse(os.path.join(static_path, "index.html"))


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/api/tasks", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    return tasks_db


@app.get("/api/tasks/{task_id}", response_model=Task)
async def get_task(task_id: int):
    """Get a specific task by ID"""
    for task in tasks_db:
        if task.id == task_id:
            return task
    return {"error": "Task not found"}, 404


@app.post("/api/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    """Create a new task"""
    new_id = max([t.id for t in tasks_db]) + 1 if tasks_db else 1
    new_task = Task(
        id=new_id,
        title=task.title,
        description=task.description,
        completed=False,
        created_at=datetime.now().isoformat(),
    )
    tasks_db.append(new_task)
    return new_task


@app.put("/api/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: TaskCreate):
    """Update a task"""
    for i, t in enumerate(tasks_db):
        if t.id == task_id:
            updated_task = Task(
                id=task_id,
                title=task.title,
                description=task.description,
                completed=t.completed,
                created_at=t.created_at,
            )
            tasks_db[i] = updated_task
            return updated_task
    return {"error": "Task not found"}, 404


@app.patch("/api/tasks/{task_id}/toggle")
async def toggle_task(task_id: int):
    """Toggle task completion status"""
    for task in tasks_db:
        if task.id == task_id:
            task.completed = not task.completed
            return task
    return {"error": "Task not found"}, 404


@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    """Delete a task"""
    global tasks_db
    initial_length = len(tasks_db)
    tasks_db = [t for t in tasks_db if t.id != task_id]
    if len(tasks_db) < initial_length:
        return {"message": "Task deleted successfully"}
    return {"error": "Task not found"}, 404


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
