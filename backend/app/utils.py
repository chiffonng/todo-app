from typing import Any, Tuple


def standardize_response(
    message: str, status_code: int, data: Any = None
) -> Tuple[dict, int]:
    """Standardize the response format."""
    response = {"message": message}
    if data:
        response["data"] = data

    return {"message": message, "data": data}, status_code
