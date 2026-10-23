from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.db.session import get_session
from app.schemas.learning import (
    AnswerCreate,
    AnswerResponse,
    LearningQueueResponse,
    ProgressResponse,
)
from app.schemas.vocabulary import Difficulty, VocabularyCategory
from app.services.learning import (
    AnswerNotDueError,
    get_progress,
    get_today_queue,
    record_answer,
)

router = APIRouter(tags=["learning"])


@router.get("/learning/today", response_model=LearningQueueResponse)
async def learning_queue(
    limit: int = Query(default=10, ge=1, le=50),
    category: VocabularyCategory | None = None,
    difficulty: Difficulty | None = None,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> LearningQueueResponse:
    return await get_today_queue(
        session,
        user_id=user_id,
        limit=limit,
        category=category,
        difficulty=difficulty,
    )


@router.post(
    "/learning/words/{word_id}/answer",
    response_model=AnswerResponse,
    status_code=status.HTTP_200_OK,
)
async def submit_answer(
    word_id: int,
    answer: AnswerCreate,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> AnswerResponse:
    try:
        async with session.begin():
            result = await record_answer(
                session,
                user_id=user_id,
                word_id=word_id,
                recalled=answer.recalled,
                mode=answer.mode,
            )
            if result is None:
                raise HTTPException(status_code=404, detail="Vocabulary word not found.")
    except AnswerNotDueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This word is not due for review yet.",
        ) from exc
    return result


@router.get("/progress", response_model=ProgressResponse)
async def learner_progress(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
) -> ProgressResponse:
    return await get_progress(session, user_id=user_id)
