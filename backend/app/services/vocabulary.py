from sqlalchemy import Select, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vocabulary import VocabularyWord
from app.schemas.vocabulary import Difficulty, VocabularyCategory


async def list_vocabulary(
    session: AsyncSession,
    *,
    category: VocabularyCategory | None = None,
    difficulty: Difficulty | None = None,
    search: str | None = None,
    limit: int = 20,
) -> list[VocabularyWord]:
    statement: Select[tuple[VocabularyWord]] = select(VocabularyWord).order_by(VocabularyWord.word)
    if category is not None:
        statement = statement.where(VocabularyWord.category == category.value)
    if difficulty is not None:
        statement = statement.where(VocabularyWord.difficulty == difficulty.value)
    if search:
        pattern = f"%{search.strip()}%"
        statement = statement.where(
            or_(VocabularyWord.word.ilike(pattern), VocabularyWord.definition.ilike(pattern))
        )
    statement = statement.limit(limit)
    return list((await session.scalars(statement)).all())
