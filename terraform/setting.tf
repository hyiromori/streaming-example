terraform {
  required_version = ">=0.12.0"

  backend "s3" {
    bucket = "hyiromori"
    region = "ap-northeast-1"
    key    = "terraform/example-video-distribution/terraform.tfstate"
  }
}

provider "aws" {
  version = ">=2.52.0"
  region  = "ap-northeast-1"
}

data "aws_caller_identity" "current" {}

variable "environment" {
  type    = string
  default = "dev"
}

locals {
  aws_account_id     = data.aws_caller_identity.current.account_id
  api_gateway_domain = "https://s3n72uknj9.execute-api.ap-northeast-1.amazonaws.com"
  project_id         = "example-video-distribution-${var.environment}"
}
