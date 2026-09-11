# MERN Todo App — DevOps Pipeline

A DevOps-focused project using a MERN Todo app as the demo workload to practice a full deployment pipeline: **containerization** (Docker/Docker Compose), **infrastructure as code** (Terraform + Ansible), **CI/CD** (GitHub Actions and Jenkins), and **monitoring** (Prometheus + Grafana) on a cloud VPS.

## Features

- Dockerized frontend and backend, orchestrated with Docker Compose
- Infrastructure provisioned and configured as code with Terraform + Ansible
- Dual CI/CD pipelines (GitHub Actions and Jenkins), both auto-deploying over SSH on push
- Metrics collection and dashboards via Prometheus + Grafana (app, MongoDB, and host metrics)
- The app itself: user auth (JWT, forgot-password via email), and CRUD todo tasks with scheduled background jobs

## Tech Stack

**DevOps:** Docker, Docker Compose, Terraform, Ansible, GitHub Actions, Jenkins, Prometheus, Grafana
**Frontend:** React 18, React Router, MUI, Tailwind CSS, Axios
**Backend:** Node.js, Express, Mongoose (MongoDB), JWT, bcrypt, Nodemailer

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

Two alternative pipelines can deploy the app — pick one, both do the same SSH + `docker-compose` redeploy to the VPS.

### GitHub Actions (`.github/workflows/main.yml`)

Runs automatically on every push to `main`. Requires these set in the repo's Settings → Secrets and variables → Actions:
- `VPS_HOST`, `VPS_KEY` (secrets) — VPS address and SSH private key
- `VPS_USER` (variable) — SSH username

### Jenkins (`Jenkinsfile`)

The `Jenkinsfile` itself has no trigger declared — the push-to-build behavior is configured on the Jenkins job instead, so it fires automatically on pushes to GitHub, same as the Actions workflow.

**One-time setup:**

1. Create a Pipeline job in Jenkins pointing at this repo ("Pipeline script from SCM") so it picks up the `Jenkinsfile`.
2. In the job's configuration, under Build Triggers, check **"GitHub hook trigger for GITScm polling"**.
3. Add the SSH credential: **Manage Jenkins → Credentials → System → Global credentials → Add Credentials** — kind "SSH Username with private key", ID `ssh-key`, username the VPS login user, and the private key paired with the VPS's `authorized_keys`.
4. Add a webhook on the GitHub repo: **Settings → Webhooks → Add webhook**, Payload URL `http://<jenkins-host>/github-webhook/`, content type `application/json`, event "Just the push event".

Once set up, every push to GitHub notifies Jenkins and triggers the pipeline.

## Infrastructure as Code (Terraform + Ansible)

The VPS is provisioned and configured with IaC, under `trfans/`: **Terraform** (`trf/`) creates the cloud server, and **Ansible** (`ans/`) installs Docker, starts MongoDB, and deploys the app onto it. Both are run via Docker locally, so no local install is needed — just copy the `*.example` config files in each folder, fill in your own values, and run Terraform then Ansible against them.

> Note: this demo is set up to provision a DigitalOcean droplet.

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
