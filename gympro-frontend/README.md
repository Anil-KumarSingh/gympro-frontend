# GymPro API

FastAPI and MongoDB backend for GymPro. It provides account authentication, member fitness tracking, support requests, and administrator endpoints.

## Features

- JWT based member registration, login, and profile management
- Workout logging and history
- Nutrition entries and summary stats
- BMI calculations and history
- Member support requests
- Role-protected admin endpoints for members, statistics, and request management

## Requirements

- Python 3.12 or newer
- MongoDB local instance or MongoDB Atlas database

## Setup on Windows

From this directory, configure a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=gympro
```

Create the environment, install packages, and start the API:

```powershell
py -m venv myenv
.\myenv\Scripts\python.exe -m pip install -r requirements.txt
.\myenv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`; interactive documentation is at `http://localhost:8000/docs`.

## Authentication and roles

Sign up at `POST /auth/signup` and sign in at `POST /auth/login`. Login returns a JWT that protected routes accept as a bearer token. New accounts are assigned the `user` role. Admin routes require a JWT with role `admin`.

To promote an existing account, select the configured MongoDB database in `mongosh` and run:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Sign in again after changing a role so the JWT contains the updated value.

## Routes

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/signup`, `POST /auth/login`, `GET /auth/profile`, `PUT /auth/profile` |
| Dashboard | `GET /dashboard/` |
| Workouts | `POST /workout/add`, `GET /workout/my`, `GET /workout/history`, `GET /workout/stats` |
| Nutrition | `POST /nutrition/add`, `GET /nutrition/my`, `GET /nutrition/stats` |
| BMI | `POST /bmi/calculate`, `GET /bmi/history` |
| Support | `POST /complaint/add`, `GET /complaint/my` |
| Admin | `GET /admin/users`, `GET /admin/complaints`, `GET /admin/stats`, `GET /admin/dashboard`, `PATCH /admin/complaint/{complaint_id}` |

## Configuration and deployment

`.env` is excluded from Git. Keep database credentials private. Before deployment, move the JWT signing key into environment configuration, restrict CORS to the frontend’s origin, and use HTTPS.
