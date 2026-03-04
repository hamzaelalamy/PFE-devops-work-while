#!/bin/bash
# Build and push Docker images to ECR
# Usage: ./scripts/build-and-push.sh <aws-account-id> <aws-region>
# Prereqs: AWS CLI configured, docker logged in to ECR (aws ecr get-login-password)

set -e

AWS_ACCOUNT_ID="${1:-}"
AWS_REGION="${2:-us-east-1}"
IMAGE_TAG="${3:-latest}"

if [ -z "$AWS_ACCOUNT_ID" ]; then
  echo "Usage: $0 <aws-account-id> [aws-region] [image-tag]"
  echo "Example: $0 123456789012 us-east-1 latest"
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
