# CORS Setup for Backend

To allow the React frontend to connect to the FastAPI backend without CORS/network issues, make sure your backend includes this middleware (typically in `main.py`):

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or set to ["http://localhost:3000", "https://your-front-url"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- For security, restrict `allow_origins` to your actual frontend domains in production.
- This ensures that fetch/axios requests from the frontend will not be blocked by browser CORS policy.

> If errors persist, double-check .env settings and network/proxy configurations.
