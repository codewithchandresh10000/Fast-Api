# FastAPI Configuration

Configuration files and environment setup for the FastAPI application.

## Environment Variables

Create a `.env` file in the project root if needed:

```
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

## Running in Development

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Running in Production

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```
