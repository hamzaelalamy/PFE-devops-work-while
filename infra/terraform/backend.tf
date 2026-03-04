# Remote backend for Terraform state
# Before first run: create the S3 bucket (see README.md) or use local backend
terraform {
  backend "s3" {
    bucket         = "workwhile-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "workwhile-terraform-locks"
  }
}
