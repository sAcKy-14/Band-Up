from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class VocabularyCategory(StrEnum):
    ACADEMIC = "academic"
    WRITING_TASK_1 = "writing_task_1"
    WRITING_TASK_2 = "writing_task_2"
    SPEAKING = "speaking"
    READING = "reading"
    LISTENING = "listening"


class Difficulty(StrEnum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class VocabularyWord(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: str
    word: str
    definition: str
    part_of_speech: str
    pronunciation: str | None = None
    synonyms: list[str] = Field(default_factory=list)
    antonyms: list[str] = Field(default_factory=list)
    example: str
    category: VocabularyCategory
    difficulty: Difficulty


class VocabularyListResponse(BaseModel):
    items: list[VocabularyWord]
    count: int
