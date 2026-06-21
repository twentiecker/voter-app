from uuid import UUID

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from passlib.context import CryptContext

from . import models
from .schemas import (
    PollSchema,
    CreatePollRequest,
    VoteRequest,
    LoginRequest,
    RegisterRequest,
    UserResponse,
)
from .database import async_session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="Voter App API")


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


async def get_current_user(
    authorization: str | None = Header(None), db: AsyncSession = Depends(get_db)
) -> models.User:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id_str = authorization.replace("Bearer ", "")
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.execute(select(models.User).where(models.User.id == user_id))
    user = user.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.post("/register", response_model=UserResponse)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> UserResponse:
    print(payload.password)
    username = payload.username.strip().lower()
    hashed_password = pwd_context.hash(payload.password)

    existing_user = await db.execute(
        select(models.User).where(models.User.username == username)
    )
    if existing_user.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already exists")

    user = models.User(
        username=username,
        name=payload.name.strip(),
        hashed_password=hashed_password,
        role="voter",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return UserResponse(
        id=str(user.id),
        username=user.username,
        name=user.name,
        role=user.role,
    )


@app.post("/login", response_model=UserResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> UserResponse:
    username = payload.username.strip().lower()
    user = await db.execute(
        select(models.User).where(models.User.username == username)
    )
    user = user.scalar_one_or_none()

    if user and pwd_context.verify(payload.password, user.hashed_password):
        return UserResponse(
            id=str(user.id),
            username=user.username,
            name=user.name,
            role=user.role,
        )

    raise HTTPException(status_code=401, detail="Invalid credentials")


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


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/polls")
async def list_polls(db: AsyncSession = Depends(get_db)) -> list[PollSchema]:
    result = await db.execute(
        select(models.Poll).options(selectinload(models.Poll.candidates))
    )
    polls = result.unique().scalars().all()
    return [PollSchema.model_validate(poll) for poll in polls]


@app.get("/polls/{poll_id}")
async def get_poll(poll_id: UUID, db: AsyncSession = Depends(get_db)) -> PollSchema:
    result = await db.execute(
        select(models.Poll).options(selectinload(models.Poll.candidates)).where(models.Poll.id == poll_id)
    )
    poll = result.scalar_one_or_none()
    if poll is None:
        raise HTTPException(status_code=404, detail="Poll not found")
    return PollSchema.model_validate(poll)


@app.post("/polls", status_code=201)
async def create_poll(
    payload: CreatePollRequest,
    db: AsyncSession = Depends(get_db),
    _: models.User = Depends(get_current_user),
) -> PollSchema:
    candidates = [
        models.Candidate(
            name=candidate.name,
            party=candidate.party,
            slogan=candidate.slogan,
        )
        for candidate in payload.candidates
    ]
    poll = models.Poll(
        title=payload.title,
        description=payload.description,
        candidates=candidates,
    )
    db.add(poll)
    await db.commit()
    await db.refresh(poll)

    # 🔥 IMPORTANT FIX
    result = await db.execute(
        select(models.Poll)
        .options(selectinload(models.Poll.candidates))
        .where(models.Poll.id == poll.id)
    )

    poll = result.scalar_one()
    
    return PollSchema.model_validate(poll)


@app.post("/polls/{poll_id}/vote")
async def vote(
    poll_id: UUID,
    payload: VoteRequest,
    db: AsyncSession = Depends(get_db),
    user: models.User = Depends(get_current_user),
) -> PollSchema:
    existing_vote = await db.execute(
        select(models.Vote).where(
            models.Vote.user_id == user.id,
            models.Vote.poll_id == poll_id
        )
    )
    if existing_vote.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already voted in this poll")

    poll = await db.execute(
        select(models.Poll).options(selectinload(models.Poll.candidates)).where(models.Poll.id == poll_id)
    )
    poll = poll.scalar_one_or_none()
    if poll is None:
        raise HTTPException(status_code=404, detail="Poll not found")

    candidate_to_vote = None
    for candidate in poll.candidates:
        if candidate.id == payload.candidate_id:
            candidate.votes += 1
            candidate_to_vote = candidate
            break

    if candidate_to_vote is None:
        raise HTTPException(status_code=404, detail="Candidate not found")

    db.add(candidate_to_vote)
    db.add(models.Vote(user_id=user.id, poll_id=poll_id, candidate_id=candidate_to_vote.id))
    await db.commit()
    await db.refresh(poll)
    return PollSchema.model_validate(poll)