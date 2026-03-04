#!/bin/bash
# Build and push Docker images to ECR
# Usage: ./scripts/build-and-push.sh
# Optional env vars:
#   AWS_ACCOUNT_ID  - AWS account ID (if not set, script will detect via STS)
#   AWS_REGION      - AWS region (default: us-east-1)
#   IMAGE_TAG       - Docker image tag (default: latest)
# Prereqs: AWS CLI configured, Docker daemon running

set -e

AWS_REGION="${AWS_REGION:-us-east-1}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Allow overriding via env, otherwise detect from STS
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$1}"

if [ -z "$AWS_ACCOUNT_ID" ]; then
  AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text 2>/dev/null || true)"
fi

if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "ERROR: Could not determine AWS account ID."
  echo "Set AWS_ACCOUNT_ID env var or configure AWS CLI credentials."
  exit 1
fi

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
BACKEND_REPO="workwhile-dev-backend"
FRONTEND_REPO="workwhile-dev-frontend"

echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_URI"

echo "Building backend..."
docker build -t "$BACKEND_REPO:$IMAGE_TAG" ./work-while-backend

echo "Building frontend..."
docker build -t "$FRONTEND_REPO:$IMAGE_TAG" ./work-while-front

echo "Tagging for ECR..."
docker tag "$BACKEND_REPO:$IMAGE_TAG" "$ECR_URI/$BACKEND_REPO:$IMAGE_TAG"
docker tag "$FRONTEND_REPO:$IMAGE_TAG" "$ECR_URI/$FRONTEND_REPO:$IMAGE_TAG"

echo "Pushing to ECR..."
docker push "$ECR_URI/$BACKEND_REPO:$IMAGE_TAG"
docker push "$ECR_URI/$FRONTEND_REPO:$IMAGE_TAG"

echo "Done. Images:"
echo "  Backend:  $ECR_URI/$BACKEND_REPO:$IMAGE_TAG"
echo "  Frontend: $ECR_URI/$FRONTEND_REPO:$IMAGE_TAG"
