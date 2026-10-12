# GymPro

GymPro is a gym member portal with a FastAPI and MongoDB backend. Members can track workouts, nutrition, BMI, and support requests. Administrators have a separate console for member and support management.

## Features

### Member portal

- Create an account and sign in
- View a fitness dashboard
- Choose from strength, core, and cardio exercises; review a step-by-step tutorial before logging a workout
- Record workout duration and estimated calories
- Log meals and nutrition macros
- Calculate BMI and review previous measurements
- Submit and review support requests
- Update profile information

### Admin console

- Dedicated administrator sign-in at `http://localhost:5500/#admin`
- View member, workout, nutrition, and support totals
- Browse members
- Review support requests and update their status

Admin access requires a MongoDB user record with `role: "admin"`. New registrations receive the `user` role.

## Technology

- **Frontend:** HTML, CSS, and JavaScript
- **Backend:** Python, FastAPI, and Uvicorn
- **Database:** MongoDB with PyMongo
- **Authentication:** JWT bearer tokens

## Project layout

```text
Gympro/
├── gympro-backend/
│   ├── app/
│   │   ├── routes/       # FastAPI route handlers
│   │   ├── models/       # Request models
│   │   └── utils/        # Authentication and security helpers
│   ├── requirements.txt
│   └── README.md
├── gympro-frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── README.md
```

## Requirements

- Python 3.12 or newer
- MongoDB running locally or a MongoDB Atlas connection string
- A modern browser

## Run locally on Windows

### 1. Configure MongoDB

In `gympro-backend`, create a `.env` file with your MongoDB connection details:

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=gympro
```

For MongoDB Atlas, set `MONGO_URI` to your Atlas connection string. Keep `.env` private; it is excluded by `.gitignore`.

### 2. Start the backend

In PowerShell:

```powershell
cd "D:\WEB Development\Gympro\gympro-backend"
py -m venv myenv
.\myenv\Scripts\python.exe -m pip install -r requirements.txt
.\myenv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive API documentation is available at `http://localhost:8000/docs`.

### 3. Start the frontend

Open a second PowerShell terminal:

```powershell
cd "D:\WEB Development\Gympro\gympro-frontend"
python -m http.server 5500
```

Open `http://localhost:5500` and create a member account or sign in. The frontend uses `http://localhost:8000` by default. Use **Change** on the sign-in screen to configure a different API URL.

## Set up an administrator account

1. Register a normal account from the member portal.
2. In MongoDB Compass or `mongosh`, select the database named in `DATABASE_NAME` and update that account’s role:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

3. Sign out, then open `http://localhost:5500/#admin` and sign in with that account’s email and password.

## API overview

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /auth/signup`, `POST /auth/login`, `GET /auth/profile`, `PUT /auth/profile` |
| Member dashboard | `GET /dashboard/` |
| Workouts | `POST /workout/add`, `GET /workout/my`, `GET /workout/history`, `GET /workout/stats` |
| Nutrition | `POST /nutrition/add`, `GET /nutrition/my`, `GET /nutrition/stats` |
| BMI | `POST /bmi/calculate`, `GET /bmi/history` |
| Support | `POST /complaint/add`, `GET /complaint/my` |
| Admin | `GET /admin/users`, `GET /admin/complaints`, `GET /admin/stats`, `GET /admin/dashboard`, `PATCH /admin/complaint/{complaint_id}` |

Protected endpoints require the JWT bearer token returned by `POST /auth/login`. Admin endpoints also require the token’s role to be `admin`.

## Before deployment

- Use a private MongoDB URI and never commit `.env`.
- Move the JWT signing key out of source code into environment configuration and use a strong private value.
- Restrict CORS to the production frontend origin.
- Serve the frontend and API over HTTPS.
