from typing import Annotated
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Candidate(BaseModel):
    id: UUID
    name: str
    party: str
    slogan: str
    votes: int = 0


class Poll(BaseModel):
    id: UUID
    title: str
    description: str
    candidates: list[Candidate]


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


app = FastAPI(title="Voter App API")


@app.post("/register", response_model=UserResponse)
def register(payload: RegisterRequest) -> UserResponse:
    username = payload.username.strip().lower()
    return UserResponse(
        id="user-" + username,
        username=username,
        name=payload.name.strip(),
        role="voter",
    )


@app.post("/login", response_model=UserResponse)
def login(payload: LoginRequest) -> UserResponse:
    username = payload.username.strip().lower()

    if username == "admin":
        return UserResponse(
            id="user-1",
            username="admin",
            name="Admin User",
            role="admin",
        )

    return UserResponse(
        id="user-2",
        username=username,
        name=username.title(),
        role="voter",
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_polls() -> list[Poll]:
    return [
        Poll(
            id=uuid4(),
            title="Community Project Vote",
            description="Choose the project the neighborhood should fund next.",
            candidates=[
                Candidate(
                    id=uuid4(),
                    name="Public Garden",
                    party="Green Spaces",
                    slogan="More shade, more food, more neighbors outside.",
                    votes=18,
                ),
                Candidate(
                    id=uuid4(),
                    name="Library Upgrade",
                    party="Learning First",
                    slogan="Modern study rooms and better digital access.",
                    votes=13,
                ),
                Candidate(
                    id=uuid4(),
                    name="Street Lighting",
                    party="Safer Blocks",
                    slogan="Brighter routes home for everyone.",
                    votes=8,
                ),
            ],
        ),
        Poll(
            id=uuid4(),
            title="Team Lunch Vote",
            description="Pick the restaurant for this Friday's team lunch.",
            candidates=[
                Candidate(
                    id=uuid4(),
                    name="Soto Corner",
                    party="Local Comfort",
                    slogan="Warm bowls, quick service, happy table.",
                    votes=9,
                ),
                Candidate(
                    id=uuid4(),
                    name="Noodle Lab",
                    party="Fast Casual",
                    slogan="Fresh noodles with enough spice for brave souls.",
                    votes=16,
                ),
                Candidate(
                    id=uuid4(),
                    name="Garden Deli",
                    party="Light Bites",
                    slogan="Sandwiches, salads, and no post-lunch coma.",
                    votes=6,
                ),
            ],
        ),
        Poll(
            id=uuid4(),
            title="Product Roadmap Priority",
            description="Vote for the feature the product team should tackle first.",
            candidates=[
                Candidate(
                    id=uuid4(),
                    name="Role Permissions",
                    party="Admin Tools",
                    slogan="Give teams better control over who can do what.",
                    votes=22,
                ),
                Candidate(
                    id=uuid4(),
                    name="Export Dashboard",
                    party="Reporting",
                    slogan="Make it simple to share results outside the app.",
                    votes=15,
                ),
                Candidate(
                    id=uuid4(),
                    name="Mobile Ballot",
                    party="Voter Access",
                    slogan="A smoother voting flow for phones and tablets.",
                    votes=19,
                ),
            ],
        ),
    ]


polls: dict[UUID, Poll] = {}
for seeded_poll in seed_polls():
    polls[seeded_poll.id] = seeded_poll


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/polls")
def list_polls() -> list[Poll]:
    return list(polls.values())


@app.get("/polls/{poll_id}")
def get_poll(poll_id: UUID) -> Poll:
    poll = polls.get(poll_id)
    if poll is None:
        raise HTTPException(status_code=404, detail="Poll not found")
    return poll


@app.post("/polls", status_code=201)
def create_poll(payload: CreatePollRequest) -> Poll:
    poll = Poll(
        id=uuid4(),
        title=payload.title,
        description=payload.description,
        candidates=[
            Candidate(
                id=uuid4(),
                name=candidate.name,
                party=candidate.party,
                slogan=candidate.slogan,
            )
            for candidate in payload.candidates
        ],
    )
    polls[poll.id] = poll
    return poll


@app.post("/polls/{poll_id}/vote")
def vote(poll_id: UUID, payload: VoteRequest) -> Poll:
    poll = polls.get(poll_id)
    if poll is None:
        raise HTTPException(status_code=404, detail="Poll not found")

    for candidate in poll.candidates:
        if candidate.id == payload.candidate_id:
            candidate.votes += 1
            return poll

    raise HTTPException(status_code=404, detail="Candidate not found")
