from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class VocabularyWord(Base):
    __tablename__ = "vocabulary_words"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    word: Mapped[str] = mapped_column(String(100), unique=True)
    definition: Mapped[str] = mapped_column(Text)
    part_of_speech: Mapped[str] = mapped_column(String(40))
    pronunciation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    synonyms: Mapped[list[str]] = mapped_column(JSONB, default=list)
    antonyms: Mapped[list[str]] = mapped_column(JSONB, default=list)
    example: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(40), index=True)
    difficulty: Mapped[str] = mapped_column(String(20), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
