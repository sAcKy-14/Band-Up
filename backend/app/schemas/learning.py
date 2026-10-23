from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.vocabulary import VocabularyWordRead


class PracticeMode(StrEnum):
    MEANING_RECALL = "meaning_recall"


class VocabularyPrompt(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    word: str
    pronunciation: str | None
    part_of_speech: str
    category: str
    difficulty: str


class LearningQueueItem(BaseModel):
    word: VocabularyPrompt
    state: str = Field(description="Either 'due' for a review or 'new' for first study")
    due_at: datetime | None = None


class LearningQueueResponse(BaseModel):
    items: list[LearningQueueItem]
    due_count: int
    new_count: int


class AnswerCreate(BaseModel):
    recalled: bool
    mode: PracticeMode = PracticeMode.MEANING_RECALL


class AnswerResponse(BaseModel):
    word: VocabularyWordRead
    word_id: int
    recalled: bool
    xp_earned: int
    xp_total: int
    current_streak: int
    next_review_at: datetime
    status: str


class DailyActivityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    activity_date: date
    words_reviewed: int
    xp_earned: int


class ProgressResponse(BaseModel):
    words_learned: int
    words_mastered: int
    words_due: int
    xp_total: int
    current_streak: int
    words_reviewed_this_week: int
    recent_activity: list[DailyActivityRead]
