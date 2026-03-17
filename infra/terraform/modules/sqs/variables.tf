variable "name_prefix" {
  type        = string
  description = "Prefix for all resource names"
}

variable "eks_node_role_name" {
  type        = string
  description = "Name of the EKS node IAM role to attach SQS policy to"
}
