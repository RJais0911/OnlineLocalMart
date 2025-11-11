## Online Local Mart - Architecture (One Slide)

Use any Mermaid-compatible viewer (VS Code Markdown Preview Mermaid, GitHub web view) to export to PNG.

```mermaid
flowchart LR
    subgraph Client
      A[Browser/UI]
    end

    subgraph Frontend[Frontend Container - Nginx]
      B[/Static HTML/CSS/JS/]
    end

    subgraph Backend[Backend Container - Node/Express]
      C[Express API<br/>src/server.js]
    end

    subgraph Database[MongoDB (optional profile)]
      D[(MongoDB)]
    end

    subgraph Monitoring[Nagios Container]
      M1[Custom Objects/Commands<br/>monitoring/nagios/*]
    end

    A -->|HTTP :80| B
    B -->|API Calls<br/>HTTP :3000| C
    C -->|Mongoose| D

    M1 -->|Checks HTTP/Containers| C
    M1 -.->|Docker Engine Metrics| Backend

    subgraph Orchestration[Docker Compose - app-network]
      Frontend --- Backend
      Backend --- Database
      Monitoring --- Backend
    end

    subgraph CI/CD[Jenkins Pipeline]
      J1[Clean + Clone]
      J2[Compose Build]
      J3[Tag + Login]
      J4[Push to Docker Hub]
      J5[Compose Up + Verify]
    end

    J1 --> J2 --> J3 --> J4 --> J5

    subgraph Registry[Docker Hub Registry]
      R[(rjais11/online-local-mart-backend:latest)]
    end

    J4 --> R
    J5 --> Orchestration

    subgraph IaC[Ansible (optional)]
      A1[site.yml<br/>provision docker/compose<br/>run services]
    end

    A1 --> Orchestration
```

Legend:
- Frontend: Nginx serves static assets from `Test/public` on port 80
- Backend: Node/Express from `Test/src/server.js` on port 3000
- Database: MongoDB (enabled via compose profile `db`)
- Orchestration: `Test/docker-compose.yml` connects services on a bridge network
- CI/CD: `Test/Jenkinsfile` builds, tags, pushes image, then deploys with compose
- Monitoring: `Test/monitoring/nagios/*` mounts into Nagios to check app health
- IaC: `Test/ansible/*` can provision and deploy the same stack

How to export to PNG (one option):
- Open this file in VS Code with Mermaid preview extension → right-click diagram → Export as PNG.


