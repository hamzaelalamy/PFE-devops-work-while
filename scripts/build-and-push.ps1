# Build and push Docker images to ECR
# Usage: .\scripts\build-and-push.ps1 -AwsAccountId <id> [-AwsRegion us-east-1] [-ImageTag latest]

param(
    [Parameter(Mandatory=$true)]
    [string]$AwsAccountId,
    [string]$AwsRegion = "us-east-1",
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"
$EnvName = "dev"
$BackendRepo = "workwhile-$EnvName-backend"
$FrontendRepo = "workwhile-$EnvName-frontend"
$EcrUri = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com"

Write-Host "Logging in to ECR..."
aws ecr get-login-password --region $AwsRegion | docker login --username AWS --password-stdin $EcrUri

Write-Host "Building backend..."
docker build -t "${BackendRepo}:$ImageTag" ./work-while-backend

Write-Host "Building frontend..."
docker build -t "${FrontendRepo}:$ImageTag" ./work-while-front

Write-Host "Tagging for ECR..."
docker tag "${BackendRepo}:$ImageTag" "${EcrUri}/${BackendRepo}:$ImageTag"
docker tag "${FrontendRepo}:$ImageTag" "${EcrUri}/${FrontendRepo}:$ImageTag"

Write-Host "Pushing to ECR..."
docker push "${EcrUri}/${BackendRepo}:$ImageTag"
docker push "${EcrUri}/${FrontendRepo}:$ImageTag"

Write-Host "Done. Images:"
Write-Host "  Backend:  ${EcrUri}/${BackendRepo}:$ImageTag"
Write-Host "  Frontend: ${EcrUri}/${FrontendRepo}:$ImageTag"
