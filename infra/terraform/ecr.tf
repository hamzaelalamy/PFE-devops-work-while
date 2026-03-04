resource "aws_ecr_repository" "backend" {
  name = "${local.name_prefix}-backend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${local.name_prefix}-backend"
  }
}

resource "aws_ecr_repository" "frontend" {
  name = "${local.name_prefix}-frontend"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${local.name_prefix}-frontend"
  }
}
