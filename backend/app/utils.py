from typing import Dict, List, Tuple
from flask import jsonify


def standardize_response(
    message: str, status_code: int, data: Dict | List = None
) -> Tuple[dict, int]:
    """Standardize the response format."""
    response = {"message": message}
    if data:
        response["data"] = data

    return response, status_code
