import jwt
from fastapi import Header, HTTPException, status
import os


def decode_jwt(token: str) -> dict:
    secret = os.getenv("JWT_SECRET", "change_this_to_a_long_random_string_min_32_chars")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_user(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")
    token = authorization[len("Bearer "):]
    payload = decode_jwt(token)
    user_id = payload.get("userId")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    return {
        "user_id": user_id,
        "email": payload.get("email"),
        "name": payload.get("name"),
        "raw_token": token,
    }
