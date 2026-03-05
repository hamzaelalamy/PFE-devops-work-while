# CI/CD Setup

## Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ROLE_ARN` | IAM role ARN for OIDC (recommended) |

### OIDC Setup (Recommended)

1. Create an IAM OIDC identity provider for GitHub in AWS.
2. Create an IAM role with trust policy allowing `sts:AssumeRoleWithWebIdentity` from your GitHub repo.
3. Attach policies: `AmazonEC2ContainerRegistryPowerUser`, `eks:DescribeCluster`, and a policy allowing `eks:AccessEntry` / kubeconfig access.
4. Add the role ARN as `AWS_ROLE_ARN` secret.
5. **Grant the role EKS access**: In Terraform, set `github_oidc_role_arn` (e.g. in `infra/terraform/environments/dev.tfvars`) to the same role ARN, then run `terraform apply`. This creates an EKS access entry so the deploy job can run `kubectl` against the cluster.

### Alternative: Static Credentials

If OIDC is not used, add:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

And change the workflow to use:

```yaml
- uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
```

## Pipeline Flow

1. **CI** (every push/PR): Lint, test backend, build frontend
2. **Build & Push** (main/master only): Build Docker images, push to ECR
3. **Deploy** (main/master only): Apply K8s manifests to EKS, wait for rollout
4. **Rollback**: Manual workflow `workflow_dispatch` to undo deployments

## Rollback

- **Automatic**: Go to Actions → Rollback Deployment → Run workflow
- **Specific revision**: Enter revision number from `kubectl rollout history deployment/backend -n workwhile`
