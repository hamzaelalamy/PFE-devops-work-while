# WorkWhile — Job Platform

[![CI/CD Pipeline](https://github.com/hamzaelalamy/PFE-devops-work-while/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/hamzaelalamy/PFE-devops-work-while/actions/workflows/ci-cd.yml)

**WorkWhile** is a full-stack job platform built with the MERN stack (MongoDB, Express, React, Node.js). It features AI-powered job matching, automated web scraping, and is deployed on AWS using a complete DevOps pipeline.

> **PFE Project** — DevOps & Cloud AWS (Simplon)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment (EKS)](#kubernetes-deployment-eks)
- [Infrastructure as Code (Terraform)](#infrastructure-as-code-terraform)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Observability](#monitoring--observability)
- [Async Processing (SQS)](#async-processing-sqs)
- [Security](#security)
- [Technical Choices](#technical-choices)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Cloud (us-east-1)                     │
│  ┌─────────────────── VPC 10.0.0.0/16 ──────────────────┐  │
│  │  Public Subnets          Private Subnets              │  │
│  │  ┌──────────┐            ┌──────────────────────┐     │  │
│  │  │ IGW  NAT │            │  EKS Node Group      │     │  │
│  │  └──────────┘            │  ┌────┐ ┌────┐ ┌───┐ │     │  │
│  │                          │  │ FE │ │ BE │ │DB │ │     │  │
│  │                          │  └────┘ └────┘ └───┘ │     │  │
│  │                          │  ┌──────────┐        │     │  │
│  │                          │  │Fluent Bit│        │     │  │
│  │                          └──────────────────────┘     │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌─────┐  ┌─────┐  ┌──────────┐  ┌──┐  ┌─────┐            │
│  │ ECR │  │ SQS │  │CloudWatch│  │S3│  │ IAM │            │
│  └─────┘  └─────┘  └──────────┘  └──┘  └─────┘            │
└─────────────────────────────────────────────────────────────┘
```

For detailed Mermaid diagrams, see [architecture-diagrams.md](architecture-diagrams.md):
- **Diagrams 1–10**: Application architecture (MCD, system design, auth flow, AI matching, scraping)
- **Diagrams 11–14**: DevOps infrastructure (AWS, CI/CD, K8s topology, VPC network)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Redux Toolkit, TailwindCSS 4, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Winston |
| **Database** | MongoDB 7 |
| **AI** | @xenova/transformers (all-MiniLM-L6-v2), cosine similarity |
| **Scraping** | Puppeteer + Stealth Plugin |
| **Containerization** | Docker (multi-stage builds), Docker Compose |
| **Orchestration** | Amazon EKS, Kubernetes, Kustomize |
| **IaC** | Terraform (modular structure, S3 backend) |
| **CI/CD** | GitHub Actions (OIDC auth, ECR push, EKS deploy) |
| **Registry** | Amazon ECR |
| **Async** | Amazon SQS + Dead-Letter Queue |
| **Monitoring** | CloudWatch (Logs, Metrics, Dashboards, Alarms) |
| **Logging** | Fluent Bit DaemonSet → CloudWatch Logs |
| **Security** | Helmet, CORS, rate limiting, mongo-sanitize, IAM least privilege |

---

## Project Structure

```
WorkWhile/
├── work-while-front/          # React frontend (Vite)
│   ├── Dockerfile             # Multi-stage: node:20-alpine → nginx:alpine
│   ├── nginx.conf             # Reverse proxy /api → backend
│   └── src/                   # React components, Redux store
│
├── work-while-backend/        # Express.js backend
│   ├── Dockerfile             # Multi-stage: node:20-bookworm-slim
│   └── src/
│       ├── controllers/       # Route handlers
│       ├── models/            # Mongoose schemas (User, Job, Company, Application)
│       ├── services/          # Business logic (Auth, AI, Email, Scraping)
│       ├── middleware/        # JWT auth, validation, error handling
│       └── routes/            # API route definitions
│
├── k8s/                       # Kubernetes manifests
│   ├── base/                  # Base Kustomization
│   │   ├── *-deployment.yaml  # Deployments (frontend, backend, mongodb)
│   │   ├── *-service.yaml     # ClusterIP services
│   │   ├── *-hpa.yaml         # HorizontalPodAutoscalers
│   │   ├── configmap.yaml     # Application configuration
│   │   ├── secret.yaml        # Sensitive data (JWT keys)
│   │   ├── ingress.yaml       # Nginx ingress
│   │   ├── fluent-bit-*.yaml  # Log forwarding DaemonSet
│   │   └── kustomization.yaml
│   └── overlays/ecr/          # ECR image overlay for EKS
│
├── infra/terraform/           # Infrastructure as Code
│   ├── main.tf                # Module composition
│   ├── modules/
│   │   ├── vpc/               # VPC, subnets, NAT, IGW
│   │   ├── iam/               # EKS & node IAM roles
│   │   ├── eks/               # EKS cluster & node group
│   │   ├── ecr/               # Container registries
│   │   ├── sqs/               # Message queues + DLQ
│   │   └── monitoring/        # CloudWatch dashboards & alarms
│   ├── environments/          # Per-environment tfvars
│   └── templates/             # Deploy script templates
│
├── .github/workflows/         # CI/CD pipelines
│   ├── ci-cd.yml              # Build → Test → Push → Deploy
│   └── rollback.yml           # Manual rollback
│
├── docker-compose.yml         # Local development stack
├── architecture-diagrams.md   # All Mermaid diagrams (14 diagrams)
└── KUBERNETES.md              # K8s deployment guide
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16 (recommended 20 LTS)
- **MongoDB** 7+ (local or Atlas)
- **Docker** & **Docker Compose** (for containerized dev)

### Local Development

```bash
# Backend
cd work-while-backend
cp .env.example .env     # Edit with your values
npm install
npm run dev              # Starts on http://localhost:5000

# Frontend
cd work-while-front
cp .env.example .env
npm install
npm run dev              # Starts on http://localhost:5173
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/workwhile` |
| `JWT_SECRET` | JWT signing secret | — (required) |
| `JWT_REFRESH_SECRET` | Refresh token secret | — (required) |
| `JWT_EXPIRE` | Token expiry | `24h` |
| `PORT` | Backend port | `5000` |
| `FRONTEND_URL` | Frontend origin (CORS) | `http://localhost:5173` |
| `NODE_ENV` | Environment | `development` |

---

## Docker Deployment

```bash
# Build and start all services (MongoDB + Backend + Frontend)
docker compose up -d --build

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:5000/api

# View logs
docker compose logs -f

# Stop
docker compose down
```

**Images:**
- **Backend**: `node:20-bookworm-slim` (multi-stage, non-root user, health check)
- **Frontend**: `node:20-alpine` → `nginx:alpine` (multi-stage, Vite build → static serve)

---

## Kubernetes Deployment (EKS)

See [KUBERNETES.md](KUBERNETES.md) for full guide.

### Key Resources

| Resource | Type | Details |
|----------|------|---------|
| Frontend | Deployment + HPA | nginx:alpine, 1–5 replicas, CPU/mem scaling |
| Backend | Deployment + HPA | node:20, RollingUpdate, 1–5 replicas |
| MongoDB | Deployment + PVC | mongo:7, persistent storage |
| Fluent Bit | DaemonSet | Log forwarding to CloudWatch |
| Ingress | nginx IngressClass | Routes `/` → frontend, `/api` → backend |
| ConfigMap | workwhile-config | Non-sensitive environment config |
| Secret | workwhile-secrets | JWT keys (created by CI/CD) |

### Quick Deploy

```bash
# EKS with ECR images
kubectl apply -k k8s/overlays/ecr/

# Local (minikube/kind)
kubectl apply -k k8s/base/
```

---

## Infrastructure as Code (Terraform)

Modular Terraform structure with 6 reusable modules:

```bash
cd infra/terraform

# Initialize
terraform init

# Plan
terraform plan -var-file=environments/dev.tfvars

# Apply
terraform apply -var-file=environments/dev.tfvars
```

### Modules

| Module | Resources Provisioned |
|--------|----------------------|
| `vpc` | VPC, 2 public + 2 private subnets, IGW, NAT Gateway, route tables |
| `iam` | EKS cluster role, node role, CloudWatch + EBS CSI + SQS policies |
| `eks` | EKS cluster, managed node group, GitHub OIDC access, EBS CSI addon |
| `ecr` | Backend + frontend container registries (scan on push) |
| `sqs` | Main queue + dead-letter queue, node IAM policy |
| `monitoring` | CloudWatch log group, 6-widget dashboard, 4 metric alarms |

**State**: Remote S3 backend with DynamoDB locking.

---

## CI/CD Pipeline

**GitHub Actions** with two workflows:

### `ci-cd.yml` — Build, Test & Deploy

| Stage | Trigger | Actions |
|-------|---------|---------|
| **CI** | Push / PR | Install deps → run tests (Jest) → lint (ESLint) → build frontend |
| **Build** | Push to main | Docker build → push to ECR (tag: git SHA + latest) |
| **Deploy** | Push to main | Update kubeconfig → create secrets → Kustomize → `kubectl apply` → wait for rollout |

### `rollback.yml` — Manual Rollback

Triggered via `workflow_dispatch`. Rolls back backend and frontend deployments to a specified revision (or previous).

**Authentication**: GitHub OIDC → AWS IAM role (no static credentials).

---

## Monitoring & Observability

### CloudWatch Dashboard (6 widgets)

| Widget | Metric |
|--------|--------|
| Node CPU Utilization | `AWS/EKS` — `node_cpu_utilization` |
| Node Memory Utilization | `AWS/EKS` — `node_memory_utilization` |
| SQS Queue Messages | Visible, Sent, Deleted counts |
| SQS DLQ Messages | Dead-letter queue monitoring |
| Application Error Logs | CloudWatch Logs Insights (error filter) |
| Cluster Overview | CPU % + Memory % single values |

### Alarms (4)

| Alarm | Condition |
|-------|-----------|
| Node CPU High | CPU > 70% for 10 minutes |
| Node Memory High | Memory > 80% for 10 minutes |
| SQS DLQ Not Empty | Dead-letter messages > 0 |
| SQS Message Age High | Oldest message > 5 minutes |

### Log Forwarding

**Fluent Bit** DaemonSet (`amazon/aws-for-fluent-bit`) runs on every node, tailing workwhile container logs and forwarding to CloudWatch Logs (`/eks/workwhile-dev`).

---

## Async Processing (SQS)

- **Main Queue**: `workwhile-dev-queue` — for asynchronous task processing
- **Dead-Letter Queue**: `workwhile-dev-dlq` — failed messages after 5 retries, retained 14 days
- **IAM**: EKS nodes have SQS send/receive/delete permissions

---

## Security

| Layer | Implementation |
|-------|---------------|
| **Network** | Private subnets for EKS nodes, NAT for outbound, IGW for ingress only |
| **IAM** | Least privilege roles for EKS cluster, nodes, GitHub OIDC |
| **Secrets** | K8s Secrets created by CI/CD (not committed to git) |
| **API** | Helmet, CORS, rate limiting (1000 req/15min), mongo-sanitize |
| **Auth** | JWT + refresh tokens, bcrypt password hashing |
| **Container** | Non-root user, multi-stage builds, health checks |
| **Registry** | ECR image scanning on push |

---

## Technical Choices

| Decision | Rationale |
|----------|-----------|
| **MERN Stack** | JavaScript end-to-end, large ecosystem, fast development |
| **Vite** | Fastest HMR for React development |
| **EKS (managed K8s)** | Production-grade orchestration without managing control plane |
| **Kustomize** | Native K8s config management, base + overlays for environments |
| **Terraform modules** | Reusable, testable infrastructure components |
| **GitHub Actions + OIDC** | No static AWS credentials, native GitHub integration |
| **Fluent Bit** | Lightweight log forwarding (~64MB memory), AWS-native integration |
| **Multi-stage Docker** | Smaller images, separate build/runtime concerns |
| **RollingUpdate strategy** | Zero-downtime deployments |
| **SQS + DLQ** | Reliable async processing with automatic retry and failure isolation |

---

## License

This project is developed as a PFE (Projet de Fin d'Études) for Simplon's DevOps & Cloud AWS program.
