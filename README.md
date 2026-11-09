# GymPro Frontend

Static HTML, CSS, and JavaScript UI for GymPro. The root `index.html` is served directly; source and runtime assets are grouped under `assets/`.

## Layout

```text
gympro-frontend/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/app.js
│   ├── js/workers/pose-worker.js
│   ├── media/                 # Local images and videos
│   └── models/                # Browser-ready custom models, when available
└── README.md
```

The active workout coach loads MediaPipe Pose Landmarker in `assets/js/workers/pose-worker.js`. Exercise cues and rep/set progress are handled by `assets/js/app.js`. No GymPro-specific form-classification model has been trained yet; future training data and model artifacts belong in the top-level `gympro-ml/` project.

## Run

Start the backend from `gympro-backend/`, then run this frontend directory with:

```powershell
python -m http.server 5500
```

Open `http://localhost:5500`. The frontend defaults to `http://localhost:8000` for its API. Camera access requires localhost or HTTPS.
