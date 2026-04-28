variable "region" {
  default = "us-east-1"
}

variable "environment" {
  default = "dev"
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}
