environment         = "dev"
cluster_version     = "1.29"
# Use a smaller instance type to reduce cost / avoid Free Tier issues
node_instance_types = ["t3.micro"]
node_desired_size   = 2
node_min_size       = 1
node_max_size       = 4
run_build_and_deploy = false