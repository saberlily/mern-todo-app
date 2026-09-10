# MERN Todo App

A full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js), containerized with Docker, deployed via Jenkins CI/CD, and monitored with Prometheus.

## Features

- User registration, login (JWT auth), and forgot-password flow (email via Nodemailer)
- Create, update, delete, and track todo tasks
- Scheduled background jobs (`backend/scheduler`)
- Dockerized frontend and backend, orchestrated with Docker Compose
- CI/CD pipeline via Jenkins (deploys over SSH to a remote server)
- Metrics collection via Prometheus (app + MongoDB exporter)

## Tech Stack

**Frontend:** React 18, React Router, MUI, Tailwind CSS, Axios
**Backend:** Node.js, Express, Mongoose (MongoDB), JWT, bcrypt, Nodemailer
**DevOps:** Docker, Docker Compose, Jenkins, Prometheus

## Project Structure

```
mern-todo-app/
├── backend/
│   ├── controllers/     # Request handlers (task, user, forgot-password)
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose schemas (task, user)
│   ├── routes/           # API routes
│   ├── scheduler/        # Scheduled/cron jobs
│   ├── server.js         # App entry point
│   └── Dockerfile
├── frontend/
│   ├── src/               # React app source
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml     # Frontend + backend services
├── prometheus.yml         # Prometheus scrape configuration
└── Jenkinsfile             # CI/CD pipeline definition
```

## Getting Started

### Prerequisites

- Node.js and Yarn/npm
- MongoDB instance (local or hosted, e.g. MongoDB Atlas)
- Docker & Docker Compose (for containerized setup)

### Backend Setup

```bash
cd backend
yarn install
```

Copy `backend/.env.example` to `backend/.env` and fill in the values:

```
MONGO_URI=<your-mongodb-connection-string>
GMAIL_USERNAME=<gmail-address-used-to-send-emails>
GMAIL_PASSWORD=<gmail-app-password>
PORT=8000
JWT_SECRET=<your-jwt-secret>
```

`MONGO_URI` depends on where the backend runs:

| Environment | Host in the URI | Notes |
|---|---|---|
| Local | `localhost` | MongoDB running directly on your machine |
| Docker | `mongodb` (service/container name) | Backend and MongoDB share a Docker network |
| VPS | `<vps-ip>` | MongoDB's port is published publicly, so the password **must be URL-encoded** (special characters like `@ : / ? # %` will otherwise break the connection string) |

`GMAIL_USERNAME`/`GMAIL_PASSWORD` are used by Nodemailer for task reminder emails and the forgot-password flow — use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular account password.

Run the backend:

```bash
node server.js
```

### Frontend Setup

```bash
cd frontend
yarn install
yarn start
```

The app runs at `http://localhost:3000` by default and expects the backend API at the URL configured in the frontend.

### Running with Docker Compose

```bash
docker-compose up -d --build
```

This builds and starts:
- `cons-frontend` on port `3000` (mapped to container port `80`)
- `cons-backend` on port `8000`

## API Overview

Base path: `/api`

- `/api/user` — registration, login, user management
- `/api/task` — CRUD operations for todo tasks
- `/api/forgotPassword` — password reset flow

## CI/CD

The `Jenkinsfile` defines a pipeline that connects to the deployment server over SSH and runs `git pull`, `docker-compose down`, `docker-compose build`, and `docker-compose up -d` to redeploy the app.

## Monitoring (Prometheus + Grafana)

Everything runs on one VPS, but not all in the same way:

- **App, MongoDB** — run on the VPS
- **Node Exporter** — runs directly on the VPS host (not in Docker); exposes host metrics (CPU, memory, disk) on port `9100`
- **mongodb-exporter** — Docker container; exposes MongoDB metrics on port `9216`
- **Prometheus** — Docker container; scrapes metrics from Node Exporter, mongodb-exporter, and itself
- **Grafana** — Docker container; reads from Prometheus and displays dashboards

**Scrape targets in `prometheus.yml`:**

| Job | Target | Why |
|---|---|---|
| `prometheus` | `localhost:9090` | self-monitoring |
| `mern-todo-app` | `<vps-ip>:9100` | Node Exporter runs on the bare host, so it's reached by the VPS's IP |
| `mongodb` | `mongodb-exporter:9216` | runs in Docker, so it's reached by container name over the internal Docker network |

If the VPS IP changes or the Docker network is renamed, update the targets in `prometheus.yml` to match.
