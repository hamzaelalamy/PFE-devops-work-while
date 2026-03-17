# ============================================
# Monitoring Module
# ============================================
# CloudWatch Log Groups, Dashboards, and Alarms
# for EKS cluster observability.

######################################
# CloudWatch Log Group
######################################

resource "aws_cloudwatch_log_group" "eks_app" {
  name              = "/eks/${var.name_prefix}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.name_prefix}-logs"
    Environment = var.name_prefix
  }
}

######################################
# CloudWatch Dashboard (6 widgets)
######################################

resource "aws_cloudwatch_dashboard" "eks_overview" {
  dashboard_name = "${var.name_prefix}-eks-dashboard"

  dashboard_body = jsonencode({
    widgets = [

      # Row 1: Node CPU & Memory
      {
        "type" : "metric",
        "x" : 0,
        "y" : 0,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "view" : "timeSeries",
          "stacked" : false,
          "region" : var.aws_region,
          "title" : "EKS Node CPU Utilization",
          "metrics" : [
            [
              "AWS/EKS",
              "node_cpu_utilization",
              "ClusterName",
              var.eks_cluster_name,
              "Nodegroup",
              var.eks_node_group_name
            ]
          ],
          "stat" : "Average",
          "period" : 300
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 0,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "view" : "timeSeries",
          "stacked" : false,
          "region" : var.aws_region,
          "title" : "EKS Node Memory Utilization",
          "metrics" : [
            [
              "AWS/EKS",
              "node_memory_utilization",
              "ClusterName",
              var.eks_cluster_name,
              "Nodegroup",
              var.eks_node_group_name
            ]
          ],
          "stat" : "Average",
          "period" : 300
        }
      },

      # Row 2: SQS Metrics
      {
        "type" : "metric",
        "x" : 0,
        "y" : 6,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "view" : "timeSeries",
          "stacked" : false,
          "region" : var.aws_region,
          "title" : "SQS Queue — Messages",
          "metrics" : [
            ["AWS/SQS", "ApproximateNumberOfMessagesVisible", "QueueName", var.sqs_queue_name, { "label" : "Visible" }],
            ["AWS/SQS", "NumberOfMessagesSent", "QueueName", var.sqs_queue_name, { "label" : "Sent" }],
            ["AWS/SQS", "NumberOfMessagesDeleted", "QueueName", var.sqs_queue_name, { "label" : "Deleted" }]
          ],
          "stat" : "Sum",
          "period" : 300
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 6,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "view" : "timeSeries",
          "stacked" : false,
          "region" : var.aws_region,
          "title" : "SQS Dead-Letter Queue — Messages",
          "metrics" : [
            ["AWS/SQS", "ApproximateNumberOfMessagesVisible", "QueueName", var.sqs_dlq_queue_name, { "label" : "DLQ Visible" }],
            ["AWS/SQS", "NumberOfMessagesSent", "QueueName", var.sqs_dlq_queue_name, { "label" : "DLQ Received" }]
          ],
          "stat" : "Sum",
          "period" : 300
        }
      },

      # Row 3: Logs & Cluster Overview
      {
        "type" : "log",
        "x" : 0,
        "y" : 12,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "region" : var.aws_region,
          "title" : "Application Error Logs",
          "query" : "SOURCE '/eks/${var.name_prefix}' | fields @timestamp, @message | filter @message like /error|Error|ERROR|exception|Exception/ | sort @timestamp desc | limit 50",
          "view" : "table"
        }
      },
      {
        "type" : "metric",
        "x" : 12,
        "y" : 12,
        "width" : 12,
        "height" : 6,
        "properties" : {
          "view" : "singleValue",
          "region" : var.aws_region,
          "title" : "Cluster Overview",
          "metrics" : [
            ["AWS/EKS", "node_cpu_utilization", "ClusterName", var.eks_cluster_name, "Nodegroup", var.eks_node_group_name, { "label" : "CPU %" }],
            ["AWS/EKS", "node_memory_utilization", "ClusterName", var.eks_cluster_name, "Nodegroup", var.eks_node_group_name, { "label" : "Memory %" }]
          ],
          "stat" : "Average",
          "period" : 300
        }
      }
    ]
  })
}

######################################
# CloudWatch Alarms
######################################

# Alarm 1: Node CPU > 70% for 10 minutes
resource "aws_cloudwatch_metric_alarm" "eks_node_cpu_high" {
  alarm_name          = "${var.name_prefix}-node-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "node_cpu_utilization"
  namespace           = "AWS/EKS"
  period              = 300
  statistic           = "Average"
  threshold           = 70

  dimensions = {
    ClusterName = var.eks_cluster_name
    Nodegroup   = var.eks_node_group_name
  }

  alarm_description  = "Alarm when average EKS node CPU is above 70% for 10 minutes"
  treat_missing_data = "missing"
}

# Alarm 2: Node Memory > 80% for 10 minutes
resource "aws_cloudwatch_metric_alarm" "eks_node_memory_high" {
  alarm_name          = "${var.name_prefix}-node-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "node_memory_utilization"
  namespace           = "AWS/EKS"
  period              = 300
  statistic           = "Average"
  threshold           = 80

  dimensions = {
    ClusterName = var.eks_cluster_name
    Nodegroup   = var.eks_node_group_name
  }

  alarm_description  = "Alarm when average EKS node memory is above 80% for 10 minutes"
  treat_missing_data = "missing"
}

# Alarm 3: SQS DLQ has messages (dead letters detected)
resource "aws_cloudwatch_metric_alarm" "sqs_dlq_not_empty" {
  alarm_name          = "${var.name_prefix}-sqs-dlq-not-empty"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Sum"
  threshold           = 0

  dimensions = {
    QueueName = var.sqs_dlq_queue_name
  }

  alarm_description  = "Alarm when messages appear in the dead-letter queue (processing failures)"
  treat_missing_data = "notBreaching"
}

# Alarm 4: SQS queue message age > 300s (messages stuck)
resource "aws_cloudwatch_metric_alarm" "sqs_queue_age_high" {
  alarm_name          = "${var.name_prefix}-sqs-message-age-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateAgeOfOldestMessage"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Maximum"
  threshold           = 300

  dimensions = {
    QueueName = var.sqs_queue_name
  }

  alarm_description  = "Alarm when SQS messages are older than 5 minutes (consumer may be down)"
  treat_missing_data = "notBreaching"
}
