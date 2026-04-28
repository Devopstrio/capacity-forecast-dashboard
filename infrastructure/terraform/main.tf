provider "aws" {
  region = var.region
}

# VPC and Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "capacity-forecast-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "capacity-public-subnet"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro"
  db_name              = "capacity_db"
  username             = "dbadmin"
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
  publicly_accessible  = true
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

resource "aws_security_group" "db_sg" {
  name        = "capacity-db-sg"
  vpc_id      = aws_vpc.main.id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Narrow this in production
  }
}

# ECS Cluster for Backend/Frontend
resource "aws_ecs_cluster" "main" {
  name = "capacity-forecast-cluster"
}

# S3 Bucket for Exported Reports
resource "aws_s3_bucket" "exports" {
  bucket = "capacity-forecast-reports-${var.environment}"
}

# Secrets Manager for API Keys
resource "aws_secretsmanager_secret" "api_secrets" {
  name = "capacity-api-secrets-${var.environment}"
}
