output "queue_url" {
  value       = aws_sqs_queue.main.id
  description = "Main SQS queue URL for async processing"
}

output "dlq_url" {
  value       = aws_sqs_queue.dlq.id
  description = "Dead-letter queue URL"
}

output "queue_name" {
  value       = aws_sqs_queue.main.name
  description = "Main SQS queue name (for CloudWatch metrics)"
}

output "dlq_name" {
  value       = aws_sqs_queue.dlq.name
  description = "Dead-letter queue name (for CloudWatch metrics)"
}
