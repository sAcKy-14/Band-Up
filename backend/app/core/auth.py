from functools import lru_cache

from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
from fastapi import Header, HTTPException, Request, status

from app.core.config import settings


@lru_cache(maxsize=1)
def _clerk_client() -> Clerk:
    if not settings.clerk_secret_key:
        raise RuntimeError("CLERK_SECRET_KEY is required to verify production requests.")
    return Clerk(bearer_auth=settings.clerk_secret_key)


def get_current_user_id(
    request: Request,
    x_dev_user_id: str | None = Header(default=None),
) -> str:
    # A local demo identity makes backend learning possible before setting up Clerk.
    # This branch is deliberately unavailable outside development.
    if settings.app_env == "development" and not settings.clerk_secret_key:
        user_id = x_dev_user_id or "demo-user"
        if len(user_id) > 100:
            raise HTTPException(status_code=400, detail="Demo user ID is too long.")
        return user_id

    if not settings.clerk_secret_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is not configured.",
        )

    try:
        request_state = _clerk_client().authenticate_request(
            request,
            AuthenticateRequestOptions(authorized_parties=settings.clerk_authorized_parties),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not verify the session token.",
        ) from exc

    is_authenticated = getattr(request_state, "is_authenticated", None)
    if is_authenticated is None:
        is_authenticated = getattr(request_state, "is_signed_in", False)
    claims = getattr(request_state, "payload", None) or {}
    user_id = claims.get("sub") if isinstance(claims, dict) else None
    if not is_authenticated or not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in to continue.")
    return str(user_id)
