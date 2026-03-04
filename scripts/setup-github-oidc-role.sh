#!/bin/bash
# Setup OIDC for GitHub Actions → AWS (ECR + EKS deploy)
# Usage: ./scripts/setup-github-oidc-role.sh <aws-account-id> <github-owner/repo>
# Example: ./scripts/setup-github-oidc-role.sh 772200096303 myorg/WorkWhile

set -e
AWS_ACCOUNT_ID="${1:?Usage: $0 <aws-account-id> <github-owner/repo>}"
GITHUB_REPO="${2:?Usage: $0 <aws-account-id> <github-owner/repo>}"
AWS_REGION="${AWS_REGION:-us-east-1}"
OIDC_PROVIDER="token.actions.githubusercontent.com"
ROLE_NAME="workwhile-github-oidc-role"

echo "Account: $AWS_ACCOUNT_ID  Repo: $GITHUB_REPO  Region: $AWS_REGION"

# 1. Create OIDC identity provider for GitHub (idempotent: safe to run again)
echo "Creating OIDC provider for GitHub..."
aws iam create-open-id-connect-provider \
  --url "https://${OIDC_PROVIDER}" \
  --client-id-list "sts.amazonaws.com" \
  --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" \
  2>/dev/null || echo "(OIDC provider already exists, continuing)"

# 2. Trust policy: allow GitHub Actions from this repo to assume the role
TRUST_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_PROVIDER}:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "${OIDC_PROVIDER}:sub": "repo:${GITHUB_REPO}:*"
        }
      }
    }
  ]
}
EOF
)

echo "Creating IAM role $ROLE_NAME..."
aws iam create-role \
  --role-name "$ROLE_NAME" \
  --assume-role-policy-document "$TRUST_POLICY" \
  --description "Role for GitHub Actions (WorkWhile CI/CD)" \
  2>/dev/null || echo "(Role may already exist, updating trust policy...)"
aws iam update-assume-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-document "$TRUST_POLICY"

# 3. Attach managed policy for ECR (push/pull)
echo "Attaching AmazonEC2ContainerRegistryPowerUser..."
aws iam attach-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-arn "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"

# 4. Inline policy for EKS (DescribeCluster, ListClusters so update-kubeconfig and kubectl work)
EKS_POLICY=$(cat <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters"
      ],
      "Resource": "*"
    }
  ]
}
EOF
)
echo "Adding EKS access policy..."
aws iam put-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "EKSDescribeAndList" \
  --policy-document "$EKS_POLICY"

ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/${ROLE_NAME}"
echo ""
echo "Done. Add this as GitHub secret AWS_ROLE_ARN:"
echo "  $ROLE_ARN"
echo ""
echo "In GitHub: Settings → Secrets and variables → Actions → New repository secret"
echo "  Name:  AWS_ROLE_ARN"
echo "  Value: $ROLE_ARN"
