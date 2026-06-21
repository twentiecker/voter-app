from uuid import UUID, uuid4

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, func, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PgUUID
from .database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(80), nullable=False)
    party = Column(String(80), nullable=False)
    slogan = Column(String(160), nullable=False)
    votes = Column(Integer, default=0)
    poll_id = Column(PgUUID(as_uuid=True), ForeignKey("polls.id"), nullable=False)

    poll = relationship("Poll", back_populates="candidates")


class Poll(Base):
    __tablename__ = "polls"

    id = Column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String(120), nullable=False)
    description = Column(String(240), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    candidates = relationship("Candidate", back_populates="poll", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    username = Column(String(80), unique=True, nullable=False)
    name = Column(String(80), nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(20), default="voter")


class Vote(Base):
    __tablename__ = "votes"

    id = Column(PgUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(PgUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    poll_id = Column(PgUUID(as_uuid=True), ForeignKey("polls.id"), nullable=False)
    candidate_id = Column(PgUUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "poll_id", name="uq_user_poll_vote"),
    )

    user = relationship("User")
    poll = relationship("Poll")
    candidate = relationship("Candidate")