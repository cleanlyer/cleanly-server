provider "aws" {
    region = "eu-west-1"
}
variable "server_port" {
  description = "The port the server will use for HTTP requests"
  default = 8080
}

output "public_ip" {
  value = "${aws_instance.cleanlyer_api.public_ip}"
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
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "cleanlyer_api" {
    ami = "ami-3548444c"
    instance_type = "t2.micro"
    security_groups = ["${aws_security_group.instance_security.id}"]
    tags {
        Name = "cleanlyer-api"
    }
    user_data = <<-EOF
            #!/bin/bash
            sudo yum install nodejs npm --enablerepo=epel
            npm install yarn -g
            mkdir app
            cd app
            wget https://github.com/cleanlyer/cleanly-server/archive/master.zip
            unzip master.zip -d ./
            rm -f master.zip
            yarn install
            yarn start
            EOF

}