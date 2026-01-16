import logging
import typing

from autogpt_libs.auth import get_user_id, requires_admin_user
from fastapi import APIRouter, Security

from backend.data.user import admin_list_users
from backend.server.v2.admin.model import AdminUsersResponse

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="",
    tags=["admin", "users"],
    dependencies=[Security(requires_admin_user)],
)


@router.get("/users", response_model=AdminUsersResponse, summary="List users")
async def list_users(
    admin_user_id: str = Security(get_user_id),
    search: typing.Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
):
    logger.info(
        "Admin user %s is listing users (page=%s, page_size=%s, search=%s)",
        admin_user_id,
        page,
        page_size,
        search,
    )
    return await admin_list_users(page=page, page_size=page_size, search=search)
