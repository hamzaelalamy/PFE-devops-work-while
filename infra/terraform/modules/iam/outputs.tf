output "eks_cluster_role_arn" {
  value = aws_iam_role.eks_cluster.arn
}

output "eks_node_role_arn" {
  value = aws_iam_role.eks_node.arn
}

output "eks_node_role_name" {
  value = aws_iam_role.eks_node.name
}

output "eks_cluster_policy_attachment" {
  value = aws_iam_role_policy_attachment.eks_cluster_policy
}

output "eks_vpc_resource_controller_attachment" {
  value = aws_iam_role_policy_attachment.eks_vpc_resource_controller
}

output "eks_node_worker_attachment" {
  value = aws_iam_role_policy_attachment.eks_node_worker
}

output "eks_node_cni_attachment" {
  value = aws_iam_role_policy_attachment.eks_node_cni
}

output "eks_node_registry_attachment" {
  value = aws_iam_role_policy_attachment.eks_node_registry
}

output "eks_node_ebs_csi_attachment" {
  value = aws_iam_role_policy_attachment.eks_node_ebs_csi
}

output "eks_node_cloudwatch_attachment" {
  value = aws_iam_role_policy_attachment.eks_node_cloudwatch
}
