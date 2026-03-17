# -----------------------------------------------------------------------------
# ECR overlay and optional build+deploy (no manual script runs)
# -----------------------------------------------------------------------------
# 1. Terraform always writes k8s/overlays/ecr/kustomization.yaml with correct
#    ECR URLs from this account (so no hardcoded account ID).
# 2. If run_build_and_deploy is true, Terraform runs a generated script once
#    that: logs in to ECR, builds and pushes both images, updates kubeconfig,
#    applies k8s/overlays/ecr and waits for rollouts.
# Destroy + re-apply: same flow; overlay is regenerated, build+deploy runs again.
# -----------------------------------------------------------------------------

locals {
  repo_root    = abspath("${path.module}/../..")
  ecr_registry = regex("^[^/]+", module.ecr.backend_repository_url)
}

# Always keep ECR kustomization in sync with Terraform (no manual edits)
resource "local_file" "kustomization_ecr" {
  content = templatefile("${path.module}/templates/kustomization-ecr.yaml.tpl", {
    ecr_backend_url  = module.ecr.backend_repository_url
    ecr_frontend_url = module.ecr.frontend_repository_url
  })
  filename             = "${local.repo_root}/k8s/overlays/ecr/kustomization.yaml"
  file_permission      = "0644"
  directory_permission = "0755"
}

# Optional: generate and run build+push+deploy (Docker + kubectl required)
resource "local_file" "deploy_script" {
  count = var.run_build_and_deploy ? 1 : 0

  content = templatefile("${path.module}/templates/deploy-ecr.sh.tpl", {
    repo_root        = local.repo_root
    ecr_registry     = local.ecr_registry
    ecr_backend_url  = module.ecr.backend_repository_url
    ecr_frontend_url = module.ecr.frontend_repository_url
    aws_region       = var.aws_region
    eks_cluster_name = module.eks.cluster_name
  })
  filename        = "${path.module}/deploy-ecr.generated.sh"
  file_permission = "0750"
}

resource "null_resource" "build_and_deploy" {
  count = var.run_build_and_deploy ? 1 : 0

  triggers = {
    kustomization = base64sha256(local_file.kustomization_ecr.content)
    script        = base64sha256(local_file.deploy_script[0].content)
    ecr_backend   = module.ecr.backend_repository_url
    ecr_frontend  = module.ecr.frontend_repository_url
    cluster       = module.eks.cluster_id
  }

  depends_on = [
    module.eks,
    local_file.kustomization_ecr,
    local_file.deploy_script,
  ]

  provisioner "local-exec" {
    command     = "bash ${abspath(path.module)}/deploy-ecr.generated.sh"
    working_dir = local.repo_root
  }
}
