output "public_ip" {
  value = "${aws_instance.cleanlyer_api.public_ip}"
}
