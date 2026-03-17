variable "name_prefix" {
  type        = string
  description = "Prefix for all resource names"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "eks_cluster_name" {
  type        = string
  description = "Name of the EKS cluster (used in subnet tags)"
}
