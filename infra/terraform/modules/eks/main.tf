# ============================================
# EKS Module
# ============================================
# Creates the EKS cluster, managed node group,
# GitHub OIDC access entries, and EBS CSI addon.

resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = var.cluster_role_arn

  vpc_config {
    subnet_ids              = concat(var.public_subnet_ids, var.private_subnet_ids)
    endpoint_public_access  = true
    endpoint_private_access = true
  }

  # Required for EKS access entries (so GitHub OIDC role can be granted cluster access)
  access_config {
    authentication_mode                         = "API_AND_CONFIG_MAP"
    bootstrap_cluster_creator_admin_permissions = true
  }

  depends_on = []

  tags = {
    Name        = var.cluster_name
    Project     = var.name_prefix
    Environment = var.name_prefix
    CostCenter  = "pfe-devops"
  }
}

resource "aws_eks_node_group" "this" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.name_prefix}-nodes"
  node_role_arn   = var.node_role_arn
  subnet_ids      = var.private_subnet_ids
  instance_types  = var.node_instance_types

  scaling_config {
    desired_size = var.node_desired_size
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  depends_on = []

  tags = {
    Name        = "${var.name_prefix}-node-group"
    Project     = var.name_prefix
    Environment = var.name_prefix
    CostCenter  = "pfe-devops"
  }
}

# Grant GitHub Actions OIDC role access to the EKS cluster (for deploy job)
resource "aws_eks_access_entry" "github_oidc" {
  count = var.github_oidc_role_arn != "" ? 1 : 0

  cluster_name  = aws_eks_cluster.this.name
  principal_arn = var.github_oidc_role_arn
  type          = "STANDARD"
}

resource "aws_eks_access_policy_association" "github_oidc_admin" {
  count = var.github_oidc_role_arn != "" ? 1 : 0

  cluster_name  = aws_eks_cluster.this.name
  principal_arn = var.github_oidc_role_arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
  access_scope {
    type = "cluster"
  }
}

# EBS CSI driver add-on so PVCs can provision EBS volumes.
resource "aws_eks_addon" "ebs_csi" {
  cluster_name  = aws_eks_cluster.this.name
  addon_name    = "aws-ebs-csi-driver"
  addon_version = null

  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  timeouts {
    create = "30m"
    update = "30m"
  }

  depends_on = [
    aws_eks_node_group.this,
  ]
}
