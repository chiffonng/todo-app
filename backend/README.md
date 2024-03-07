# API Documentation

All endpoints are prefixed with `/api/`

All endpoints  Swagger UI (Swagger 2.0) and is accessible via the base URL `http://127.0.0.1:5000/api`. If the port is different (as shown in `app/config.py`), replace `5000` with the correct port number.
---

# General Notes
- User authentication is mandatory for accessing all endpoints.
- The application uses SQLAlchemy for database operations and Flask-Login for user session management.
- Configuration settings like database connection, session cookies, and security keys are managed via environment variables.

I don't have enough time to upgrade this to a full-fledged REST API like OpenAPI 3. I will do it in the future.
```