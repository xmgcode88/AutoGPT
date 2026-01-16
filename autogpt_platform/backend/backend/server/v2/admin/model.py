from datetime import datetime

from pydantic import BaseModel

from backend.data.model import UserTransaction
from backend.util.models import Pagination


class AdminUserSummary(BaseModel):
    id: str
    email: str
    name: str | None = None
    email_verified: bool
    timezone: str
    created_at: datetime
    updated_at: datetime


class AdminUsersResponse(BaseModel):
    users: list[AdminUserSummary]
    pagination: Pagination


class UserHistoryResponse(BaseModel):
    """Response model for listings with version history"""

    history: list[UserTransaction]
    pagination: Pagination


class AddUserCreditsResponse(BaseModel):
    new_balance: int
    transaction_key: str
