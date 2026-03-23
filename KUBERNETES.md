# WorkWhile - Kubernetes Deployment

This guide explains how to deploy WorkWhile on Kubernetes instead of Docker Compose.

## Prerequisites

- **kubectl** – Kubernetes CLI
- **Kubernetes cluster** – One of:
  - [minikube](https://minikube.sigs.k8s.io/docs/start/) (local)
  - [kind](https://kind.sigs.k8s.io/) (local)
  - Cloud cluster (GKE, EKS, AKS, etc.)
- **Docker images** – Built and available to the cluster

## Architecture

```
                    ┌─────────────────┐
                    │    Ingress /    │
                    │  NodePort       │
                    └────────┬────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    │                    │
┌─────────────────┐           │           ┌─────────────────┐
│    Frontend     │◀──────────┘           │    Backend      │
│    (Nginx)      │  /api proxied        │    (Node.js)    │
│    Port 80      │                      │    Port 5000    │
└─────────────────┘                      └────────┬────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │    MongoDB      │
                                         │    Port 27017   │
                                         └─────────────────┘
```

## Quick Start

### 1. Build Docker Images

**Option A: Local cluster (minikube/kind)** – Use the cluster's Docker daemon:

```bash
# Minikube
eval $(minikube docker-env)

# Build images (no registry needed)
docker build -t workwhile-backend:latest ./work-while-backend
docker build -t workwhile-frontend:latest ./work-while-front
```

**Option B: Remote cluster** – Push to a registry:

```bash
# Replace with your registry (Docker Hub, GCR, ACR, etc.)
export REGISTRY=yourusername  # or gcr.io/your-project

docker build -t $REGISTRY/workwhile-backend:latest ./work-while-backend
docker build -t $REGISTRY/workwhile-frontend:latest ./work-while-front
docker push $REGISTRY/workwhile-backend:latest
docker push $REGISTRY/workwhile-frontend:latest

# Update image names in k8s/backend-deployment.yaml and k8s/frontend-deployment.yaml
```

### 2. Create Secrets

In this project, **production secrets on EKS** are created automatically by the **GitHub Actions deploy workflow** (see `.github/workflows/ci-cd.yml`), which runs:

```bash
kubectl create namespace workwhile --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic workwhile-secrets -n workwhile \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  --from-literal=JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
  --dry-run=client -o yaml | kubectl apply -f -
```

For **local clusters** (minikube/kind), you can create the Secret manually:

```bash
kubectl create namespace workwhile

kubectl create secret generic workwhile-secrets -n workwhile \
  --from-literal=JWT_SECRET=$(openssl rand -base64 32) \
  --from-literal=JWT_REFRESH_SECRET=$(openssl rand -base64 32)
```

### 3. Apply Manifests

**For EKS with ECR images (production path used in CI/CD):**

```bash
kubectl apply -k k8s/overlays/ecr/
```

**For local clusters (minikube/kind):**

```bash
kubectl apply -k k8s/base/
```

### 4. Access the App

**Option A (EKS) – LoadBalancer Service (current production setup)**

The `frontend` Service is of type `LoadBalancer`, so AWS creates an external URL:

```bash
kubectl get svc frontend -n workwhile
```

Open the value from the `EXTERNAL-IP` column in your browser:

```text
http://<EXTERNAL-IP>  # or the ELB hostname
```

**Option B: Ingress (minikube)**

```bash
minikube addons enable ingress
# Add to your hosts file: 127.0.0.1 workwhile.local
minikube tunnel   # or: minikube ingress
# Visit http://workwhile.local
```

**Option C: Port forward (simplest)**

```bash
kubectl port-forward svc/frontend 8080:80 -n workwhile
# Visit http://localhost:8080
```

**Option D: NodePort**

```bash
# Replace ClusterIP frontend service with NodePort variant
kubectl apply -f k8s/frontend-service-nodeport.yaml
minikube service frontend -n workwhile  # Opens in browser
```

## File Overview

| File | Purpose |
|------|---------|
| `base/` | Base Kustomization with all manifests |
| `base/namespace.yaml` | Isolates WorkWhile in its own namespace |
| `base/configmap.yaml` | Non-sensitive config (URLs, env) |
| `base/mongodb-*.yaml` | MongoDB deployment, service, PVC |
| `base/backend-*.yaml` | Backend deployment, service, HPA, PVC |
| `base/frontend-*.yaml` | Frontend deployment, service, HPA (type LoadBalancer) |
| `base/fluent-bit-*.yaml` | Fluent Bit DaemonSet + ConfigMap for CloudWatch Logs |
| `base/ingress.yaml` | Optional: external access via Ingress controller (for local clusters) |
| `kustomization.yaml` | Root for base; references all base manifests |
| `overlays/ecr/` | Overlay for ECR images and production EKS deployment |
| `frontend-service-nodeport.yaml` | Optional: NodePort for local access |

## Update ConfigMap for Production

Edit `k8s/base/configmap.yaml` before applying:

- `FRONTEND_URL` – Public URL users visit (e.g. `https://workwhile.example.com`)
- `BACKEND_URL` – Public API URL (for file URLs in emails)

## Troubleshooting

**Images not found (minikube/kind):**
- Ensure you ran `eval $(minikube docker-env)` before building
- Set `imagePullPolicy: Never` in deployments (already set for local images)

**Pods not starting:**
```bash
kubectl get pods -n workwhile
kubectl describe pod <pod-name> -n workwhile
kubectl logs <pod-name> -n workwhile
```

**Backend can't connect to MongoDB:**
- Ensure MongoDB pod is Running and Ready
- Check: `kubectl get svc mongodb -n workwhile`
- Service name `mongodb` resolves to `mongodb.workwhile.svc.cluster.local`

**Frontend can't reach backend:**
- Backend service must be named `backend` (nginx config expects it)
- Both must be in the `workwhile` namespace
