variable "project_name" {
  type    = string
  default = "workwhile"
}

variable "environment" {
  type        = string
  description = "Environment name (dev, staging, prod)"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "cluster_version" {
  type        = string
  description = "Kubernetes version for EKS cluster"
  default     = "1.29"
}

variable "node_instance_types" {
  type        = list(string)
  description = "EC2 instance types for EKS node group"
  # Use a free-tier-eligible instance type to avoid billing issues
  default     = ["t3.micro"]
}

variable "node_desired_size" {
  type        = number
  description = "Desired number of nodes in the node group"
  default     = 2
}

variable "node_min_size" {
  type        = number
  default     = 1
}

variable "node_max_size" {
  type        = number
  default     = 4
}

variable "run_build_and_deploy" {
  type        = bool
  default     = true
  description = "If true, after infra is created Terraform will build/push Docker images and deploy to EKS (requires Docker and kubectl). Set to false to skip (e.g. CI does it separately)."
}

variable "github_oidc_role_arn" {
  type        = string
  default     = ""
  description = "IAM role ARN used by GitHub Actions OIDC (e.g. arn:aws:iam::ACCOUNT:role/workwhile-github-oidc-role). Set in tfvars so the role can access the EKS cluster for deploy."
}
