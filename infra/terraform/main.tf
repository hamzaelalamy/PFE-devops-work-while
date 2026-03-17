# ============================================
# WorkWhile Infrastructure — Root Module
# ============================================
# Composes all sub-modules to provision the
# complete AWS infrastructure.

locals {
  name_prefix      = "${var.project_name}-${var.environment}"
  eks_cluster_name = local.name_prefix
}

# ---- Networking ----
module "vpc" {
  source = "./modules/vpc"

  name_prefix      = local.name_prefix
  vpc_cidr         = var.vpc_cidr
  eks_cluster_name = local.eks_cluster_name
}

# ---- Identity & Access ----
module "iam" {
  source = "./modules/iam"

  name_prefix = local.name_prefix
}

# ---- Kubernetes Cluster ----
module "eks" {
  source = "./modules/eks"

  name_prefix         = local.name_prefix
  cluster_name        = local.eks_cluster_name
  cluster_version     = var.cluster_version
  cluster_role_arn    = module.iam.eks_cluster_role_arn
  node_role_arn       = module.iam.eks_node_role_arn
  public_subnet_ids   = module.vpc.public_subnet_ids
  private_subnet_ids  = module.vpc.private_subnet_ids
  node_instance_types = var.node_instance_types
  node_desired_size   = var.node_desired_size
  node_min_size       = var.node_min_size
  node_max_size       = var.node_max_size
  github_oidc_role_arn = var.github_oidc_role_arn

  depends_on = [module.iam]
}

# ---- Container Registry ----
module "ecr" {
  source = "./modules/ecr"

  name_prefix = local.name_prefix
}

# ---- Async Processing ----
module "sqs" {
  source = "./modules/sqs"

  name_prefix        = local.name_prefix
  eks_node_role_name = module.iam.eks_node_role_name
}

# ---- Monitoring & Observability ----
module "monitoring" {
  source = "./modules/monitoring"

  name_prefix         = local.name_prefix
  aws_region          = var.aws_region
  eks_cluster_name    = module.eks.cluster_name
  eks_node_group_name = module.eks.node_group_name
  sqs_queue_name      = module.sqs.queue_name
  sqs_dlq_queue_name  = module.sqs.dlq_name
}
