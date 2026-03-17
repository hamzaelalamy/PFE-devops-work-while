# ============================================
# SQS Module
# ============================================
# Creates an SQS queue with a dead-letter queue
# and grants EKS nodes permission to use them.

locals {
  sqs_queue_name     = "${var.name_prefix}-queue"
  sqs_dlq_queue_name = "${var.name_prefix}-dlq"
}

resource "aws_sqs_queue" "dlq" {
  name                      = local.sqs_dlq_queue_name
  message_retention_seconds = 1209600 # 14 days
}

resource "aws_sqs_queue" "main" {
  name = local.sqs_queue_name

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 5
  })

  visibility_timeout_seconds = 30
}

data "aws_iam_policy_document" "eks_node_sqs" {
  statement {
    effect = "Allow"

    actions = [
      "sqs:SendMessage",
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:GetQueueUrl"
    ]

    resources = [
      aws_sqs_queue.main.arn,
      aws_sqs_queue.dlq.arn,
    ]
  }
}

resource "aws_iam_policy" "eks_node_sqs" {
  name   = "${var.name_prefix}-node-sqs"
  policy = data.aws_iam_policy_document.eks_node_sqs.json
}

resource "aws_iam_role_policy_attachment" "eks_node_sqs" {
  role       = var.eks_node_role_name
  policy_arn = aws_iam_policy.eks_node_sqs.arn
}
