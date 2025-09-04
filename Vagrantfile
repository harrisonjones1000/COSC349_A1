# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-22.04"

  #---------
  # Database VM
  #---------
  config.vm.define "dbserver" do |dbserver|
    dbserver.vm.hostname = "dbserver"

    # Private network IP
    dbserver.vm.network "private_network", ip: "192.168.56.12"
    dbserver.vm.network "forwarded_port", guest: 22, host: 2201, id: "ssh"


    # Shared folder
    dbserver.vm.synced_folder ".", "/vagrant",
      owner: "vagrant", group: "vagrant",
      mount_options: ["dmode=775,fmode=777"]

    # Provision script
    dbserver.vm.provision "shell", path: "build-dbserver-vm.sh"
  end

  #---------
  # Middleware VM
  #---------
  config.vm.define "middleware" do |middleware|
    middleware.vm.hostname = "middleware"
    middleware.vm.boot_timeout = 600

    # Private network IP
    middleware.vm.network "private_network", ip: "192.168.56.13"

    middleware.vm.network "forwarded_port", guest: 22, host: 2203, id: "ssh"


    middleware.vm.synced_folder ".", "/vagrant",
      owner: "vagrant", group: "vagrant",
      mount_options: ["dmode=775,fmode=777"]

    middleware.vm.provision "shell", path: "build-middleware-vm.sh"
  end

  #---------
  # Webserver VM
  #---------
  config.vm.define "webserver" do |webserver|
    webserver.vm.hostname = "webserver"

    # Host port 8080 → guest port 80 for HTTP
    webserver.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

    # Private network IP for VM-to-VM communication
    webserver.vm.network "private_network", ip: "192.168.56.11"

    webserver.vm.network "forwarded_port", guest: 22, host: 2202, auto_correct: true, id: "ssh"


    webserver.vm.synced_folder ".", "/vagrant",
      owner: "vagrant", group: "vagrant",
      mount_options: ["dmode=775,fmode=777"]

    webserver.vm.provision "shell", path: "build-frontend-vm.sh"
  end
end
