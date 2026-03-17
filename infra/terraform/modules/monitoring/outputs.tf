output "dashboard_arn" {
  value = aws_cloudwatch_dashboard.eks_overview.dashboard_arn
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.eks_app.name
}

output "log_group_arn" {
  value = aws_cloudwatch_log_group.eks_app.arn
}

output "cpu_alarm_arn" {
  value = aws_cloudwatch_metric_alarm.eks_node_cpu_high.arn
}

output "memory_alarm_arn" {
  value = aws_cloudwatch_metric_alarm.eks_node_memory_high.arn
}

output "sqs_dlq_alarm_arn" {
  value = aws_cloudwatch_metric_alarm.sqs_dlq_not_empty.arn
}

output "sqs_age_alarm_arn" {
  value = aws_cloudwatch_metric_alarm.sqs_queue_age_high.arn
}
