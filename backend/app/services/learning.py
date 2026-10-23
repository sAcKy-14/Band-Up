from datetime import UTC, date, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learning import DailyActivity, ReviewAttempt, User, UserWord
from app.models.vocabulary import VocabularyWord
from app.schemas.learning import (
    AnswerResponse,
    LearningQueueItem,
    LearningQueueResponse,
    PracticeMode,
    ProgressResponse,
    VocabularyPrompt,
)
from app.schemas.vocabulary import Difficulty, VocabularyCategory, VocabularyWordRead


class AnswerNotDueError(Exception):
    """Raised when a word is submitted again before its scheduled review."""


async def get_today_queue(
    session: AsyncSession,
    *,
    user_id: str,
    limit: int = 10,
    category: VocabularyCategory | None = None,
    difficulty: Difficulty | None = None,
) -> LearningQueueResponse:
    now = datetime.now(UTC)
    due_statement = (
        select(UserWord, VocabularyWord)
        .join(VocabularyWord, VocabularyWord.id == UserWord.word_id)
        .where(UserWord.user_id == user_id, UserWord.due_at <= now)
        .order_by(UserWord.due_at, VocabularyWord.id)
        .limit(limit)
    )
    if category is not None:
        due_statement = due_statement.where(VocabularyWord.category == category.value)
    if difficulty is not None:
        due_statement = due_statement.where(VocabularyWord.difficulty == difficulty.value)
    due_rows = (await session.execute(due_statement)).all()
    items = [
        LearningQueueItem(
            word=VocabularyPrompt.model_validate(word),
            state="due",
            due_at=progress.due_at,
        )
        for progress, word in due_rows
    ]

    remaining = limit - len(items)
    if remaining:
        learned_word_ids = select(UserWord.word_id).where(UserWord.user_id == user_id)
        new_statement = (
            select(VocabularyWord)
            .where(~VocabularyWord.id.in_(learned_word_ids))
            .order_by(VocabularyWord.id)
            .limit(remaining)
        )
        if category is not None:
            new_statement = new_statement.where(VocabularyWord.category == category.value)
        if difficulty is not None:
            new_statement = new_statement.where(VocabularyWord.difficulty == difficulty.value)
        new_words = (await session.scalars(new_statement)).all()
        items.extend(
            LearningQueueItem(word=VocabularyPrompt.model_validate(word), state="new")
            for word in new_words
        )
    due_count = sum(item.state == "due" for item in items)
    return LearningQueueResponse(items=items, due_count=due_count, new_count=len(items) - due_count)


async def record_answer(
    session: AsyncSession,
    *,
    user_id: str,
    word_id: int,
    recalled: bool,
    mode: PracticeMode,
) -> AnswerResponse | None:
    now = datetime.now(UTC)
    today = now.date()

    word = await session.get(VocabularyWord, word_id)
    if word is None:
        return None

    user = await session.get(User, user_id)
    if user is None:
        user = User(id=user_id)
        session.add(user)
        await session.flush()

    progress_statement = select(UserWord).where(
        UserWord.user_id == user_id, UserWord.word_id == word_id
    )
    progress = await session.scalar(progress_statement)
    if progress is None:
        progress = UserWord(user_id=user_id, word_id=word_id)
        session.add(progress)
        await session.flush()
    elif progress.last_reviewed_at is not None and progress.due_at > now:
        raise AnswerNotDueError

    previously_reviewed_today = (
        progress.last_reviewed_at is not None and progress.last_reviewed_at.date() == today
    )
    if recalled:
        if progress.interval_days == 0:
            progress.interval_days = 1
        elif progress.interval_days == 1:
            progress.interval_days = 3
        else:
            progress.interval_days = max(1, round(progress.interval_days * progress.ease_factor))
        progress.ease_factor = min(2.8, progress.ease_factor + 0.1)
        progress.consecutive_correct += 1
        progress.times_correct += 1
        progress.status = "mastered" if progress.consecutive_correct >= 5 else "review"
        progress.due_at = now + timedelta(days=progress.interval_days)
        xp_earned = 10
    else:
        progress.ease_factor = max(1.3, progress.ease_factor - 0.2)
        progress.consecutive_correct = 0
        progress.times_incorrect += 1
        progress.interval_days = 0
        progress.status = "learning"
        progress.due_at = now + timedelta(minutes=10)
        xp_earned = 3

    progress.last_reviewed_at = now
    user.xp_total += xp_earned
    if user.last_active_on != today:
        user.current_streak = (
            user.current_streak + 1
            if user.last_active_on == today - timedelta(days=1)
            else 1
        )
        user.last_active_on = today

    activity_statement = select(DailyActivity).where(
        DailyActivity.user_id == user_id, DailyActivity.activity_date == today
    )
    activity = await session.scalar(activity_statement)
    if activity is None:
        activity = DailyActivity(
            user_id=user_id, activity_date=today, words_reviewed=0, xp_earned=0
        )
        session.add(activity)
    if not previously_reviewed_today:
        activity.words_reviewed += 1
    activity.xp_earned += xp_earned

    session.add(
        ReviewAttempt(
            user_id=user_id,
            word_id=word_id,
            recalled=recalled,
            mode=mode.value,
            xp_awarded=xp_earned,
            reviewed_at=now,
        )
    )
    await session.flush()
    return AnswerResponse(
        word=VocabularyWordRead.model_validate(word),
        word_id=word_id,
        recalled=recalled,
        xp_earned=xp_earned,
        xp_total=user.xp_total,
        current_streak=user.current_streak,
        next_review_at=progress.due_at,
        status=progress.status,
    )


async def get_progress(session: AsyncSession, *, user_id: str) -> ProgressResponse:
    now = datetime.now(UTC)
    today = now.date()
    week_start = today - timedelta(days=6)
    user = await session.get(User, user_id)

    words_learned = await session.scalar(
        select(func.count(UserWord.id)).where(UserWord.user_id == user_id)
    )
    words_mastered = await session.scalar(
        select(func.count(UserWord.id)).where(
            UserWord.user_id == user_id, UserWord.status == "mastered"
        )
    )
    words_due = await session.scalar(
        select(func.count(UserWord.id)).where(
            UserWord.user_id == user_id, UserWord.due_at <= now
        )
    )
    activity_statement = (
        select(DailyActivity)
        .where(DailyActivity.user_id == user_id, DailyActivity.activity_date >= week_start)
        .order_by(DailyActivity.activity_date.desc())
    )
    recent_activity = list((await session.scalars(activity_statement)).all())

    return ProgressResponse(
        words_learned=words_learned or 0,
        words_mastered=words_mastered or 0,
        words_due=words_due or 0,
        xp_total=user.xp_total if user else 0,
        current_streak=user.current_streak if user else 0,
        words_reviewed_this_week=sum(day.words_reviewed for day in recent_activity),
        recent_activity=recent_activity,
    )
