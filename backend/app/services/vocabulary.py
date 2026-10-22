from app.schemas.vocabulary import (
    Difficulty,
    VocabularyCategory,
    VocabularyWord,
)

# Temporary seed data to define the API contract before database integration.
_WORDS = [
    VocabularyWord(
        id="word-001",
        word="mitigate",
        definition="To make something harmful or severe less serious.",
        part_of_speech="verb",
        pronunciation="/ˈmɪtɪɡeɪt/",
        synonyms=["alleviate", "reduce"],
        antonyms=["aggravate"],
        example="Planting trees can mitigate the effects of air pollution.",
        category=VocabularyCategory.ACADEMIC,
        difficulty=Difficulty.INTERMEDIATE,
    ),
    VocabularyWord(
        id="word-002",
        word="proliferate",
        definition="To increase rapidly in number or amount.",
        part_of_speech="verb",
        pronunciation="/prəˈlɪfəreɪt/",
        synonyms=["multiply", "expand"],
        antonyms=["decline"],
        example="Online learning resources have proliferated in recent years.",
        category=VocabularyCategory.WRITING_TASK_2,
        difficulty=Difficulty.ADVANCED,
    ),
    VocabularyWord(
        id="word-003",
        word="coherent",
        definition="Logical and consistent; easy to understand.",
        part_of_speech="adjective",
        pronunciation="/kəʊˈhɪərənt/",
        synonyms=["logical", "consistent"],
        antonyms=["confusing", "incoherent"],
        example="A coherent argument helps readers follow the main point.",
        category=VocabularyCategory.WRITING_TASK_2,
        difficulty=Difficulty.BEGINNER,
    ),
]


def list_vocabulary(
    *,
    category: VocabularyCategory | None = None,
    difficulty: Difficulty | None = None,
    limit: int = 20,
) -> list[VocabularyWord]:
    words = _WORDS
    if category is not None:
        words = [word for word in words if word.category == category]
    if difficulty is not None:
        words = [word for word in words if word.difficulty == difficulty]
    return words[:limit]
