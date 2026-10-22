from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.schemas.vocabulary import (
    Difficulty,
    VocabularyCategory,
    VocabularyListResponse,
)
from app.services.vocabulary import list_vocabulary

router = APIRouter(prefix="/vocabulary", tags=["vocabulary"])


@router.get("", response_model=VocabularyListResponse)
async def get_vocabulary(
    category: VocabularyCategory | None = None,
    difficulty: Difficulty | None = None,
    search: str | None = Query(default=None, max_length=100),
    limit: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
) -> VocabularyListResponse:
    items = await list_vocabulary(
        session, category=category, difficulty=difficulty, search=search, limit=limit
    )
    return VocabularyListResponse(items=items, count=len(items))
