#!/bin/bash
set -e
REPO_ROOT="${repo_root}"
ECR_REGISTRY="${ecr_registry}"
ECR_BACKEND="${ecr_backend_url}"
ECR_FRONTEND="${ecr_frontend_url}"
AWS_REGION="${aws_region}"
EKS_CLUSTER="${eks_cluster_name}"

cd "$REPO_ROOT"
echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"

echo "Building backend..."
docker build -t "$ECR_BACKEND:latest" ./work-while-backend
echo "Building frontend..."
docker build -t "$ECR_FRONTEND:latest" ./work-while-front

echo "Pushing to ECR..."
docker push "$ECR_BACKEND:latest"
docker push "$ECR_FRONTEND:latest"

echo "Updating kubeconfig..."
aws eks update-kubeconfig --region "$AWS_REGION" --name "$EKS_CLUSTER"

echo "Deploying to EKS..."
kubectl apply -k k8s/overlays/ecr/
kubectl rollout status deployment/backend -n workwhile --timeout=5m
kubectl rollout status deployment/frontend -n workwhile --timeout=5m
echo "Done."
