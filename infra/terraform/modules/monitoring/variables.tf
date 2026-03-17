variable "name_prefix" {
  type        = string
  description = "Prefix for all resource names"
}

variable "aws_region" {
  type        = string
  description = "AWS region for CloudWatch"
}

variable "eks_cluster_name" {
  type        = string
  description = "Name of the EKS cluster"
}

variable "eks_node_group_name" {
  type        = string
  description = "Name of the EKS node group"
}

variable "sqs_queue_name" {
  type        = string
  description = "Name of the main SQS queue"
}

variable "sqs_dlq_queue_name" {
  type        = string
  description = "Name of the SQS dead-letter queue"
}

variable "log_retention_days" {
  type        = number
  description = "Number of days to retain CloudWatch logs"
  default     = 30
}
