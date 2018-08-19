terraform {
  backend "s3" {
    bucket = "cleanly-terraform-states"
    key    = "cleanlyer-api.tfstate"
    region = "eu-west-1"
  }
}
