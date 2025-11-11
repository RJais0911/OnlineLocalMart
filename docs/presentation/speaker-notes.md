## Speaker Notes (≈60s per file)
Keep it crisp; emphasize how DevOps ties pieces together.

### Test/Dockerfile (Backend)
- This Dockerfile packages the Node/Express backend.
- It sets a stable Node base image, caches `npm install` by copying `package*.json` first, then copies source.
- Exposes 3000 and starts `node src/server.js`. `ENV NODE_PATH` ensures module resolution inside container.
- In CI, Jenkins/Compose use this to build a reproducible backend image for all environments.

### Test/public/Dockerfile.frontend (Frontend)
- Nginx serves static HTML/CSS/JS from `/usr/share/nginx/html` on port 80.
- No runtime Node required for the frontend—keeps the image small and fast.
- Compose builds this image and wires it to the same network as backend.

### Test/docker-compose.yml (Orchestration)
- Defines multi-service app: `frontend`, `backend`, optional `mongodb` (profile `db`), and `nagios` for monitoring.
- Creates a bridge network so services discover each other by name.
- Maps host ports, injects env vars from `.env`, and attaches a volume for dev iteration on `./src`.
- This file is the single command deploy (`docker compose up -d`).

### Test/Jenkinsfile (CI/CD)
- Declarative pipeline: clean → clone → compose build → tag → login → push → compose up → verify.
- Uses Jenkins credentials to log in to Docker Hub and publish the backend image.
- Final stage runs containers and lists them; post actions email success/failure to notify stakeholders.
- This automates the path from commit to running containers.

### Test/src/server.js (Express API)
- Sets up Express with body parsing and static serving from `public`.
- Connects to Mongo via `connectDB()` and defines Mongoose models `Shop` and `Item`.
- Key routes: register shop, login, list vendors, vendor details with items, product details, add item, featured list.
- This is the API the frontend calls; health and correctness are observable via Nagios checks.

### Test/src/db.js (Database Connector)
- Loads `MONGO_URI` from `.env` (fallback to Atlas URI) and connects with Mongoose.
- On failure, logs and exits to fail fast so orchestrators (Compose/Jenkins) surface the issue.

### Test/public/* (Static Frontend)
- HTML pages for index, registration, login, vendor, product views; CSS for styling; JS for API calls.
- These scripts call backend endpoints defined in `server.js` to render data-driven views.
- Nginx serves these assets efficiently in the `frontend` container.

### Test/monitoring/nagios/*
- Custom object/command/plugin configs mounted into the official Nagios image.
- Checks backend HTTP endpoints and container stats via `check_container_stats.sh` and Docker socket.
- Provides early warning on downtime or performance issues in the CI/CD-deployed stack.

### Test/ansible/*
- Playbooks to provision Docker/Compose and deploy services on hosts (optional path in addition to Jenkins).
- Ensures idempotent setup for consistent environments beyond local dev.

### Test/package.json
- Declares backend entrypoint and scripts: `start` and `dev` (nodemon).
- Central list of backend runtime dependencies used during Docker build and local dev.

### Test/README.md
- Top-level documentation for running via Compose, CI/CD overview, and optional Ansible/Nagios usage.
- Good anchor for onboarding and for viva explanation.

### LICENSE
- MIT license clarifies usage and distribution rights.

## One-liner DevOps Story
“Jenkins builds and publishes our backend Docker image, Compose deploys the whole stack (frontend, backend, DB, monitoring) on one network, and Nagios continuously checks service health—giving us a repeatable path from code to production-like runtime.”


