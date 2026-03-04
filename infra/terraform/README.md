# WorkWhile - Terraform Infrastructure

Provisions AWS infrastructure for WorkWhile: VPC, EKS cluster, ECR repositories.

## Prerequisites

- Terraform >= 1.5
- AWS CLI configured
- For EKS: `kubectl`, `aws-iam-authenticator` (or use `aws eks update-kubeconfig`)

## Backend Setup (First Time)

Before `terraform init`, create the S3 bucket and DynamoDB table for state:

```bash
aws s3 mb s3://workwhile-terraform-state --region us-east-1
aws s3api put-bucket-versioning --bucket workwhile-terraform-state \
  --versioning-configuration Status=Enabled
aws dynamodb create-table --table-name workwhile-terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST --region us-east-1
```

Or use local backend: in `backend.tf`, comment out the `backend "s3"` block.

## Usage

```bash
cd infra/terraform
terraform init
terraform plan -var-file=environments/dev.tfvars
terraform apply -var-file=environments/dev.tfvars
```

## Outputs

After apply:

- `ecr_backend_url` - Push backend image here
- `ecr_frontend_url` - Push frontend image here
- `configure_kubectl` - Run to configure kubectl for the cluster

## ECR overlay and deploy (no manual scripts)

- **Kustomization**: Terraform writes `k8s/overlays/ecr/kustomization.yaml` with the correct ECR URLs for this account, so you never edit that file by hand.
- **Build + deploy**: If `run_build_and_deploy` is `true` (default), after infra is created Terraform runs a generated script that: logs in to ECR, builds and pushes backend/frontend images, updates kubeconfig, and runs `kubectl apply -k k8s/overlays/ecr/`. Requires Docker and `kubectl` where Terraform runs (e.g. WSL or CI).
- To skip the automatic build/deploy (e.g. CI does it), set in your tfvars: `run_build_and_deploy = false`.
- After destroy + re-apply, the overlay is regenerated and build+deploy runs again.
