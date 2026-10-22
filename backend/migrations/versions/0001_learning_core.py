"""Create vocabulary and learner progress tables.

Revision ID: 0001_learning_core
Revises:
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0001_learning_core"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=100), primary_key=True),
        sa.Column("xp_total", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("current_streak", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_active_on", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "vocabulary_words",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("word", sa.String(length=100), nullable=False, unique=True),
        sa.Column("definition", sa.Text(), nullable=False),
        sa.Column("part_of_speech", sa.String(length=40), nullable=False),
        sa.Column("pronunciation", sa.String(length=100), nullable=True),
        sa.Column("synonyms", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("antonyms", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("example", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=40), nullable=False),
        sa.Column("difficulty", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_vocabulary_words_category", "vocabulary_words", ["category"])
    op.create_index("ix_vocabulary_words_difficulty", "vocabulary_words", ["difficulty"])
    op.create_table(
        "user_words",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=100), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("word_id", sa.Integer(), sa.ForeignKey("vocabulary_words.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="learning"),
        sa.Column("interval_days", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("ease_factor", sa.Float(), nullable=False, server_default="2.3"),
        sa.Column("consecutive_correct", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("times_correct", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("times_incorrect", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("due_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("last_reviewed_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("user_id", "word_id", name="uq_user_words_user_word"),
    )
    op.create_index("ix_user_words_due", "user_words", ["user_id", "due_at"])
    op.create_index("ix_user_words_due_at", "user_words", ["due_at"])
    op.create_table(
        "review_attempts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=100), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("word_id", sa.Integer(), sa.ForeignKey("vocabulary_words.id", ondelete="CASCADE"), nullable=False),
        sa.Column("recalled", sa.Boolean(), nullable=False),
        sa.Column("mode", sa.String(length=30), nullable=False, server_default="meaning_recall"),
        sa.Column("xp_awarded", sa.Integer(), nullable=False),
        sa.Column("reviewed_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_review_attempts_user_time", "review_attempts", ["user_id", "reviewed_at"])
    op.create_table(
        "daily_activity",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=100), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("activity_date", sa.Date(), nullable=False),
        sa.Column("words_reviewed", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("xp_earned", sa.Integer(), nullable=False, server_default="0"),
        sa.UniqueConstraint("user_id", "activity_date", name="uq_daily_activity_user_date"),
    )


def downgrade() -> None:
    op.drop_table("daily_activity")
    op.drop_index("ix_review_attempts_user_time", table_name="review_attempts")
    op.drop_table("review_attempts")
    op.drop_index("ix_user_words_due_at", table_name="user_words")
    op.drop_index("ix_user_words_due", table_name="user_words")
    op.drop_table("user_words")
    op.drop_index("ix_vocabulary_words_difficulty", table_name="vocabulary_words")
    op.drop_index("ix_vocabulary_words_category", table_name="vocabulary_words")
    op.drop_table("vocabulary_words")
    op.drop_table("users")
