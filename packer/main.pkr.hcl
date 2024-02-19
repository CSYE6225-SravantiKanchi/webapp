packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = "> 1"
    }
  }
}

variable "project_id" {
  description = "Google Cloud project ID"
  default     = "cloud-assigment-4"
}

variable "zone" {
  description = "Zone where the image will be built"
  default     = "us-east5-a"
}

variable "disk_size" {
  description = "Disk size in GB"
  default     = 20
}

variable "disk_type" {
  description = "Disk type"
  default     = "pd-standard"
}

variable "source_image" {
  description = "The source image family for the machine image"
  default     = "centos-stream-8-v20240110"
}

variable "network" {
  description = "The network where the VM will be created"
  default     = "default"
}

variable "ssh_username" {
  description = "The username for SSH access"
  default     = "ubuntu"
}

source "googlecompute" "centos-example" {
  project_id           = var.project_id
  source_image         = var.source_image
  zone                 = var.zone
  disk_size            = var.disk_size
  disk_type            = var.disk_type
  wait_to_add_ssh_keys = "20s"
  network              = var.network
  communicator         = "ssh"
  ssh_username         = var.ssh_username
}

build {
  sources = ["source.googlecompute.centos-example"]


  provisioner "shell" {
    scripts = ["packer/scripts/usergroup.sh"]

  }

  provisioner "file" {
    source      = "./webapp_dev.zip"
    destination = "/home/ubuntu/webapp"
  }
  provisioner "shell" {
    scripts = ["packer/scripts/setup.sh", "packer/scripts/webapp.sh"]

  }

  post-processor "manifest" {
    output = "image_manifest.json"
  }
}
