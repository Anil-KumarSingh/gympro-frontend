# GymPro frontend

A responsive member and admin portal for the FastAPI backend in `gympro-backend`.

## Run locally

1. In a terminal, change into `gympro-backend` and start the API with `uvicorn app.main:app --reload`.
2. In another terminal, change into `gympro-frontend` and serve the UI with `python -m http.server 5500`.
3. Open `http://localhost:5500` in your browser. The API allows local frontend origins on ports 5173 and 5500.
4. Sign in with a backend account. The first screen also offers a demo preview without an API account.

The API URL defaults to `http://localhost:8000`. On the sign-in screen, use **Change** beside the API URL to point the UI at another backend. The token and signed-in profile are kept in browser local storage.

The member sign-in page links to a dedicated administrator sign-in page, also available at `http://localhost:5500/#admin`. Admin sign-in accepts only accounts whose MongoDB role is `admin`; member sign-in rejects those accounts.

## Screens

- Sign in and registration
- Member dashboard, exercise picker with step-by-step tutorials and workout logging, nutrition journal, BMI tracker, support requests, and profile settings
- Separate admin console with its own overview, member directory, and support request management

The member forms use the matching `/auth`, `/dashboard`, `/workout`, `/nutrition`, `/bmi`, and `/complaint` endpoints. Admin accounts need `role: "admin"` in MongoDB; the backend checks that role on `/admin` endpoints. New sign-ups are created as members.
