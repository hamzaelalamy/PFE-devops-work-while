# ============================================
# ECR Module
# ============================================
# Creates ECR repositories for backend and frontend images.

resource "aws_ecr_repository" "backend" {
  name = "${var.name_prefix}-backend"

  force_delete = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.name_prefix}-backend"
    Project     = var.name_prefix
    Environment = var.name_prefix
    CostCenter  = "pfe-devops"
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "${var.name_prefix}-frontend"

  force_delete = true

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name        = "${var.name_prefix}-frontend"
    Project     = var.name_prefix
    Environment = var.name_prefix
    CostCenter  = "pfe-devops"
  }
}
