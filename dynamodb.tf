terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.48.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "us-west-2"
}

resource "aws_dynamodb_table" "user_table" {
  name         = "user"
  hash_key     = "uid"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "uid"
    type = "S"
  }

  tags = {
    Name        = "dynamodb-table-1"
    Environment = "development"
  }

}
resource "aws_dynamodb_table" "problem_table" {
  name         = "problem"
  hash_key     = "pid"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "pid"
    type = "S"
  }

  tags = {
    Name        = "dynamodb-table-2"
    Environment = "development"
  }
}

resource "aws_dynamodb_table" "submission_table" {
  name         = "submission"
  hash_key     = "sid"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "sid"
    type = "S"
  }

  tags = {
    Name        = "dynamodb-table-3"
    Environment = "development"
  }
}


resource "aws_dynamodb_table" "clarification_table" {
  name         = "clarification"
  hash_key     = "cid"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "cid"
    type = "S"
  }

  tags = {
    Name        = "dynamodb-table-4"
    Environment = "development"
  }
}

resource "aws_dynamodb_table" "setting_table" {
  name         = "setting"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "dynamodb-table-4"
    Environment = "development"
  }
}
