# Task Manager - FastAPI with Frontend UI

A modern, fully-functional task management application built with **FastAPI** backend and a beautiful **Vanilla JavaScript** frontend.

## Features

✨ **Backend (FastAPI)**
- RESTful API endpoints for task management (CRUD operations)
- Async request handling with Uvicorn
- Pydantic models for data validation
- Health check endpoint
- Static file serving
- Automatic API documentation with Swagger UI and ReDoc

✨ **Frontend (Vanilla JavaScript)**
- Beautiful, responsive UI with modern CSS
- Real-time task management
- Filter tasks (All, Active, Completed)
- Create, read, update, and delete tasks
- Health status indicator
- Success/error notifications
- Mobile-friendly design

## Project Structure

```
Fast-Api/
├── app/
│   └── main.py                 # FastAPI application
├── static/
│   ├── index.html              # Main HTML page
│   ├── style.css               # Styling (CSS Grid, Flexbox, Variables)
│   └── script.js               # Frontend logic (Fetch API, DOM manipulation)
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Fast-Api
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

Start the FastAPI server:

```bash
python -m uvicorn app.main:app --reload
```

Or directly:

```bash
cd app && python main.py
```

The application will be available at:
- **Main Application:** http://localhost:8000
- **Swagger API Docs:** http://localhost:8000/docs
- **ReDoc API Docs:** http://localhost:8000/redoc

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve main HTML page |
| GET | `/api/health` | Health check endpoint |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update a task |
| PATCH | `/api/tasks/{id}/toggle` | Toggle task completion status |
| DELETE | `/api/tasks/{id}` | Delete a task |

### Example API Requests

**Create a task:**
```bash
curl -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn FastAPI",
    "description": "Master the FastAPI framework"
  }'
```

**Get all tasks:**
```bash
curl "http://localhost:8000/api/tasks"
```

**Toggle task completion:**
```bash
curl -X PATCH "http://localhost:8000/api/tasks/1/toggle"
```

**Delete a task:**
```bash
curl -X DELETE "http://localhost:8000/api/tasks/1"
```

## Frontend Features

### Task Management
- ✅ Create new tasks with title and description
- ✅ View all tasks with details
- ✅ Mark tasks as complete/incomplete
- ✅ Edit existing tasks
- ✅ Delete tasks
- ✅ Filter tasks (All, Active, Completed)

### User Interface
- 🎨 Modern gradient background
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔔 Real-time notifications (success/error)
- 🟢 API health status indicator
- ⚡ Smooth animations and transitions

## Technologies Used

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS with Fetch API

## Customization

### Change Port
Edit the port in `app/main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8080)
```

### Add More Features
You can extend the application by:
1. Adding new API endpoints in `app/main.py`
2. Creating database models with SQLAlchemy
3. Adding authentication with JWT
4. Implementing user-specific tasks
5. Adding categories or tags to tasks

## Troubleshooting

**Port Already in Use:**
```bash
python -m uvicorn app.main:app --reload --port 8001
```

**Module Not Found:**
Make sure you've installed all dependencies:
```bash
pip install -r requirements.txt
```

**CORS Issues:**
If you need to serve the frontend from a different domain, add CORS middleware to `app/main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Performance Tips

- The application uses in-memory storage. For production, use a database (PostgreSQL, MongoDB, etc.)
- Consider adding pagination for large datasets
- Implement caching with Redis for frequently accessed data
- Add rate limiting to protect the API

## Future Enhancements

- [ ] Database integration (SQLAlchemy + PostgreSQL)
- [ ] User authentication and authorization
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] Task sharing and collaboration
- [ ] Dark mode
- [ ] Export tasks to CSV/PDF
- [ ] Search functionality

## License

This project is open source and available under the MIT License.

## Author

Created with ❤️ using FastAPI and Vanilla JavaScript

---

**Happy Coding! 🚀**
