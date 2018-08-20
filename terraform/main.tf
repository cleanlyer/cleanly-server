provider "aws" {
    region = "eu-west-1"
}

data "terraform_remote_state" "network" {
  backend = "s3"
  config {
    bucket = "cleanly-terraform-states"
    key    = "cleanlyer-api.tfstate"
    region = "eu-west-1"
  }
}

resource "aws_security_group" "instance_security" {
    name = "cleanlyer-api-instance"

    ingress {
        from_port = "${var.server_port}"
        to_port = "${var.server_port}"
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "cleanlyer_api" {
    ami = "ami-3548444c"
    instance_type = "t2.micro"
    vpc_security_group_ids = ["${aws_security_group.instance_security.id}"]
    tags {
        Name = "cleanlyer-api"
    }
    user_data = <<-EOF
              #!/bin/bash
              echo "Hello, World" > index.html
              nohup busybox httpd -f -p "${var.server_port}" &
              EOF

}