from sqlalchemy.dialects.postgresql import insert

from app.db.session import SessionFactory
from app.models.vocabulary import VocabularyWord

SEED_WORDS = [
    {"word": "mitigate", "definition": "To make something harmful or severe less serious.", "part_of_speech": "verb", "pronunciation": "/ˈmɪtɪɡeɪt/", "synonyms": ["alleviate", "reduce"], "antonyms": ["aggravate"], "example": "Planting trees can mitigate the effects of air pollution.", "category": "academic", "difficulty": "intermediate"},
    {"word": "proliferate", "definition": "To increase rapidly in number or amount.", "part_of_speech": "verb", "pronunciation": "/prəˈlɪfəreɪt/", "synonyms": ["multiply", "expand"], "antonyms": ["decline"], "example": "Online learning resources have proliferated in recent years.", "category": "writing_task_2", "difficulty": "advanced"},
    {"word": "coherent", "definition": "Logical and consistent; easy to understand.", "part_of_speech": "adjective", "pronunciation": "/kəʊˈhɪərənt/", "synonyms": ["logical", "consistent"], "antonyms": ["confusing", "incoherent"], "example": "A coherent argument helps readers follow the main point.", "category": "writing_task_2", "difficulty": "beginner"},
    {"word": "ubiquitous", "definition": "Present, appearing, or found everywhere.", "part_of_speech": "adjective", "pronunciation": "/juːˈbɪkwɪtəs/", "synonyms": ["omnipresent", "widespread"], "antonyms": [], "example": "Smartphones have become ubiquitous in modern society.", "category": "academic", "difficulty": "advanced"},
    {"word": "resilient", "definition": "Able to recover quickly from difficulty.", "part_of_speech": "adjective", "pronunciation": "/rɪˈzɪliənt/", "synonyms": ["adaptable", "strong"], "antonyms": ["fragile"], "example": "A resilient community can adapt to economic change.", "category": "speaking", "difficulty": "intermediate"},
    {"word": "substantiate", "definition": "To support a claim with evidence or proof.", "part_of_speech": "verb", "pronunciation": "/səbˈstænʃieɪt/", "synonyms": ["verify", "validate"], "antonyms": [], "example": "Writers should substantiate their arguments with research.", "category": "writing_task_2", "difficulty": "advanced"},
    {"word": "fluctuate", "definition": "To rise and fall irregularly in number or amount.", "part_of_speech": "verb", "pronunciation": "/ˈflʌktʃueɪt/", "synonyms": ["vary", "oscillate"], "antonyms": ["stabilize"], "example": "The chart shows that energy prices fluctuated throughout the year.", "category": "writing_task_1", "difficulty": "intermediate"},
    {"word": "predominant", "definition": "Present as the strongest or most common element.", "part_of_speech": "adjective", "pronunciation": "/prɪˈdɒmɪnənt/", "synonyms": ["main", "prevailing"], "antonyms": ["minor"], "example": "Rail travel was the predominant form of transport in the region.", "category": "writing_task_1", "difficulty": "intermediate"},
    {"word": "concise", "definition": "Giving information clearly in few words.", "part_of_speech": "adjective", "pronunciation": "/kənˈsaɪs/", "synonyms": ["brief", "succinct"], "antonyms": ["wordy"], "example": "A concise summary helps the reader understand the main findings.", "category": "writing_task_2", "difficulty": "beginner"},
    {"word": "conventional", "definition": "Based on what is generally done or believed.", "part_of_speech": "adjective", "pronunciation": "/kənˈvenʃənəl/", "synonyms": ["traditional", "standard"], "antonyms": ["unconventional"], "example": "Some families are moving away from conventional working patterns.", "category": "reading", "difficulty": "beginner"},
    {"word": "feasible", "definition": "Possible and practical to do successfully.", "part_of_speech": "adjective", "pronunciation": "/ˈfiːzəbəl/", "synonyms": ["viable", "practical"], "antonyms": ["impractical"], "example": "The report considers whether the proposed transport plan is feasible.", "category": "listening", "difficulty": "intermediate"},
    {"word": "compelling", "definition": "Strongly interesting or persuasive.", "part_of_speech": "adjective", "pronunciation": "/kəmˈpelɪŋ/", "synonyms": ["persuasive", "convincing"], "antonyms": ["unconvincing"], "example": "The speaker presented a compelling case for protecting local parks.", "category": "speaking", "difficulty": "intermediate"},
]


async def seed_vocabulary() -> None:
    async with SessionFactory() as session:
        statement = insert(VocabularyWord).values(SEED_WORDS).on_conflict_do_nothing(index_elements=["word"])
        await session.execute(statement)
        await session.commit()


if __name__ == "__main__":
    import asyncio

    asyncio.run(seed_vocabulary())
