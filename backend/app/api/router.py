from fastapi import APIRouter

from app.api.routes import health, learning, vocabulary

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(vocabulary.router)
api_router.include_router(learning.router)
