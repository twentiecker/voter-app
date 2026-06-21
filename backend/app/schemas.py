from uuid import UUID
from typing import Annotated

from pydantic import BaseModel, Field


class CandidateSchema(BaseModel):
    id: UUID
    name: str
    party: str
    slogan: str
    votes: int = 0

    class Config:
        from_attributes = True


class PollSchema(BaseModel):
    id: UUID
    title: str
    description: str
    candidates: list[CandidateSchema]

    class Config:
        from_attributes = True


class VoteRequest(BaseModel):
    candidate_id: UUID


class CreateCandidateRequest(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=80)]
    party: Annotated[str, Field(min_length=1, max_length=80)]
    slogan: Annotated[str, Field(min_length=1, max_length=160)]


class CreatePollRequest(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=120)]
    description: Annotated[str, Field(min_length=1, max_length=240)]
    candidates: Annotated[list[CreateCandidateRequest], Field(min_length=2)]


class LoginRequest(BaseModel):
    username: Annotated[str, Field(min_length=1, max_length=80)]
    password: Annotated[str, Field(min_length=1, max_length=80)]


class RegisterRequest(LoginRequest):
    name: Annotated[str, Field(min_length=1, max_length=80)]


class UserResponse(BaseModel):
    id: str
    username: str
    name: str
    role: str

    class Config:
        from_attributes = True