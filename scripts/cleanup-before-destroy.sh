#!/bin/bash
# Run this BEFORE terraform destroy when you get ECR "not empty" and subnet/IGW dependency errors.
# Usage: ./scripts/cleanup-before-destroy.sh [aws-region]
# Then run: cd infra/terraform && terraform destroy -var-file=environments/dev.tfvars

set -e
AWS_REGION="${1:-us-east-1}"
REPO_BACKEND="workwhile-dev-backend"
REPO_FRONTEND="workwhile-dev-frontend"
VPC_ID="vpc-0a22eff9832a9758a"

echo "=== 1. Deleting ECR images and repos (Terraform force_delete can fail on destroy) ==="
for repo in "$REPO_BACKEND" "$REPO_FRONTEND"; do
  if aws ecr describe-repositories --repository-names "$repo" --region "$AWS_REGION" 2>/dev/null; then
    echo "Force-deleting repo: $repo"
    aws ecr delete-repository --repository-name "$repo" --region "$AWS_REGION" --force
  else
    echo "Repo $repo not found or already deleted."
  fi
done

echo "=== 2. Removing ECR repos from Terraform state (so destroy skips them) ==="
cd "$(dirname "$0")/../infra/terraform"
terraform state rm 'aws_ecr_repository.backend' 2>/dev/null || true
terraform state rm 'aws_ecr_repository.frontend' 2>/dev/null || true

echo "=== 3. Deleting any Application/Network Load Balancers (ELBv2) in the project VPC ==="
LBS=$(aws elbv2 describe-load-balancers --region "$AWS_REGION" --query "LoadBalancers[?VpcId=='$VPC_ID'].LoadBalancerArn" --output text)
for arn in $LBS; do
  [ -z "$arn" ] && continue
  echo "Deleting Load Balancer: $arn"
  aws elbv2 delete-load-balancer --load-balancer-arn "$arn" --region "$AWS_REGION"
done

echo "=== 4. Deleting any Classic ELBs in the project VPC ==="
CLASSIC_ELBS=$(aws elb describe-load-balancers --region "$AWS_REGION" --query "LoadBalancerDescriptions[?VPCId=='$VPC_ID'].LoadBalancerName" --output text)
for name in $CLASSIC_ELBS; do
  [ -z "$name" ] && continue
  echo "Deleting Classic ELB: $name"
  aws elb delete-load-balancer --load-balancer-name "$name" --region "$AWS_REGION"
done

echo "=== 5. Waiting 30s for ENIs to release after LB deletion ==="
sleep 30

echo "=== 6. Deleting orphan (available) ENIs in VPC so subnet/VPC can be removed ==="
ENIS=$(aws ec2 describe-network-interfaces --region "$AWS_REGION" --filters "Name=vpc-id,Values=$VPC_ID" "Name=status,Values=available" --query "NetworkInterfaces[].NetworkInterfaceId" --output text 2>/dev/null || true)
for eni in $ENIS; do
  [ -z "$eni" ] && continue
  echo "Deleting ENI: $eni"
  aws ec2 delete-network-interface --network-interface-id "$eni" --region "$AWS_REGION" 2>/dev/null || true
done

echo "=== 7. Waiting 15s then deleting any ENIs that became available ==="
sleep 15
ENIS=$(aws ec2 describe-network-interfaces --region "$AWS_REGION" --filters "Name=vpc-id,Values=$VPC_ID" "Name=status,Values=available" --query "NetworkInterfaces[].NetworkInterfaceId" --output text 2>/dev/null || true)
for eni in $ENIS; do
  [ -z "$eni" ] && continue
  echo "Deleting ENI: $eni"
  aws ec2 delete-network-interface --network-interface-id "$eni" --region "$AWS_REGION" 2>/dev/null || true
done

echo "=== 8. ENIs still in VPC (in-use ENIs block delete; wait and run script again or run destroy) ==="
aws ec2 describe-network-interfaces --region "$AWS_REGION" --filters "Name=vpc-id,Values=$VPC_ID" --query "NetworkInterfaces[].[NetworkInterfaceId,Description,SubnetId,Status]" --output table 2>/dev/null || true

echo "Done. Run: cd infra/terraform && terraform destroy -var-file=environments/dev.tfvars"
