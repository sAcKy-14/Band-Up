from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    # Clerk user IDs are stable external identities; passwords stay with Clerk.
    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    xp_total: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    current_streak: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    last_active_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class UserWord(Base):
    __tablename__ = "user_words"
    __table_args__ = (
        UniqueConstraint("user_id", "word_id", name="uq_user_words_user_word"),
        Index("ix_user_words_due", "user_id", "due_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    word_id: Mapped[int] = mapped_column(ForeignKey("vocabulary_words.id", ondelete="CASCADE"))
    status: Mapped[str] = mapped_column(String(20), default="learning", server_default="learning")
    interval_days: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    ease_factor: Mapped[float] = mapped_column(Float, default=2.3, server_default="2.3")
    consecutive_correct: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    times_correct: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    times_incorrect: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    last_reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class ReviewAttempt(Base):
    __tablename__ = "review_attempts"
    __table_args__ = (Index("ix_review_attempts_user_time", "user_id", "reviewed_at"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    word_id: Mapped[int] = mapped_column(ForeignKey("vocabulary_words.id", ondelete="CASCADE"))
    recalled: Mapped[bool] = mapped_column(Boolean)
    mode: Mapped[str] = mapped_column(
        String(30), default="meaning_recall", server_default="meaning_recall"
    )
    xp_awarded: Mapped[int] = mapped_column(Integer)
    reviewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class DailyActivity(Base):
    __tablename__ = "daily_activity"
    __table_args__ = (UniqueConstraint("user_id", "activity_date", name="uq_daily_activity_user_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    activity_date: Mapped[date] = mapped_column(Date)
    words_reviewed: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    xp_earned: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
