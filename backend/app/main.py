from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.routes.analytics_routes import router as analytics_router

app = FastAPI(
    title="RutuDrishti AI — Climate Intelligence Studio API",
    description="Explainable Machine Learning Framework for Climate Risk Prediction and Agricultural Vulnerability Intelligence",
    version="2.0.0"
)

# CORS setup for local React dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount outputs for direct static visualization retrieval
os.makedirs("outputs/figures", exist_ok=True)
os.makedirs("outputs/tables", exist_ok=True)
app.mount("/outputs/figures", StaticFiles(directory="outputs/figures"), name="figures")
app.mount("/outputs/tables", StaticFiles(directory="outputs/tables"), name="tables")

# Include Router
app.include_router(analytics_router)

# Mount Frontend Production Build if present
dist_dir = "frontend/dist"
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
    
    @app.get("/")
    def serve_frontend():
        from fastapi.responses import FileResponse
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": "RutuDrishti AI",
            "description": "Climate Intelligence Studio — Agricultural Vulnerability & Risk Prediction",
            "status": "operational",
            "docs_url": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
