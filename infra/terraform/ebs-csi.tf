# EBS CSI driver add-on so PVCs can provision EBS volumes.
# We let the driver use the EKS node IAM role (which has AmazonEBSCSIDriverPolicy)
# instead of a separate IRSA role. This avoids needing an additional OIDC provider.

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
    aws_iam_role_policy_attachment.eks_node_ebs_csi,
  ]
}
