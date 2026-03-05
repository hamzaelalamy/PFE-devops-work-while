environment         = "dev"
cluster_version     = "1.29"
# Use a smaller instance type to reduce cost / avoid Free Tier issues
node_instance_types = ["t3.micro"]
node_desired_size   = 2
node_min_size       = 1
node_max_size       = 4
run_build_and_deploy = false

# Required for GitHub Actions deploy job to run kubectl against EKS
github_oidc_role_arn = "arn:aws:iam::772200096303:role/workwhile-github-oidc-role"