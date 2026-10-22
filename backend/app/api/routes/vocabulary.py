from fastapi import APIRouter, Query

from app.schemas.vocabulary import (
    Difficulty,
    VocabularyCategory,
    VocabularyListResponse,
)
from app.services.vocabulary import list_vocabulary

router = APIRouter(prefix="/vocabulary", tags=["vocabulary"])


@router.get("", response_model=VocabularyListResponse)
def get_vocabulary(
    category: VocabularyCategory | None = None,
    difficulty: Difficulty | None = None,
    limit: int = Query(default=20, ge=1, le=100),
) -> VocabularyListResponse:
    items = list_vocabulary(category=category, difficulty=difficulty, limit=limit)
    return VocabularyListResponse(items=items, count=len(items))
