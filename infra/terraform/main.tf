locals {
  name_prefix       = "${var.project_name}-${var.environment}"
  eks_cluster_name  = local.name_prefix
}
