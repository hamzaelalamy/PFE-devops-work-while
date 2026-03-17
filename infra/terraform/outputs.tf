# ============================================
# Root Outputs
# ============================================

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  value = module.vpc.private_subnet_ids
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value     = module.eks.cluster_endpoint
  sensitive = true
}

output "ecr_backend_url" {
  value = module.ecr.backend_repository_url
}

output "ecr_frontend_url" {
  value = module.ecr.frontend_repository_url
}

output "configure_kubectl" {
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
  description = "Run this command to configure kubectl"
}

output "sqs_queue_url" {
  value       = module.sqs.queue_url
  description = "Main SQS queue URL for async processing"
}

output "sqs_dlq_url" {
  value       = module.sqs.dlq_url
  description = "Dead-letter queue URL"
}
