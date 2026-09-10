variable "do_token" {
  description = "DigitalOcean API token"
}

variable "ssh_key" {
  description = "SSH key fingerprint for DigitalOcean"
}

terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.95.0"
    }
  }
}

provider "digitalocean" {
  # Configuration options
  token = var.do_token
}

resource "digitalocean_droplet" "setup" {
  name    = "terraform-todo-app"
  image   = "ubuntu-24-04-x64"
  region  = "sgp1"
  size    = "s-1vcpu-2gb"
  ssh_keys = [var.ssh_key]
}

output "droplet_ip" {
  value = digitalocean_droplet.setup.ipv4_address
}