# -*- mode: ruby -*-
# vi: set ft=ruby :

# A Vagrantfile to set up three VMs, a webserver and a database 
# server, and middleware connecting them via an internal network 
# with manually-assigned IP addresses for the VMs.
Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-22.04"

  config.vm.boot_timeout = 400
  #---------
  # Database VM
  #---------
  config.vm.define "dbserver" do |dbserver|
    dbserver.vm.hostname = "dbserver"

    # Manually assigned static private IP
    dbserver.vm.network "private_network", ip: "192.168.56.12"

    # Port forwarding: allows host machine to SSH into the VM
    # auto_correct: true ensures Vagrant automatically picks a free host port
    # if 2201 is already in use, preventing collisions that previously caused
    # VMs to hang while waiting to boot. The id "ssh" labels this rule for
    # Vagrant’s internal management.

    dbserver.vm.network "forwarded_port", guest: 22, host: 2201, auto_correct: true, id: "ssh"

    # Shared folder
    dbserver.vm.synced_folder ".", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]

    # Provision script
    dbserver.vm.provision "shell", path: "build-dbserver-vm.sh"
  end

  #---------
  # Middleware VM
  #---------
  config.vm.define "middleware" do |middleware|
    middleware.vm.hostname = "middleware"

    middleware.vm.network "private_network", ip: "192.168.56.13"

    middleware.vm.network "forwarded_port", guest: 22, host: 2202, auto_correct: true, id: "ssh"

    middleware.vm.synced_folder ".", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]

    middleware.vm.provision "shell", path: "build-middleware-vm.sh", run: "always"
  end

  #---------
  # Webserver VM
  #---------
  config.vm.define "webserver" do |webserver|
    webserver.vm.hostname = "webserver"

    # When host connects to localhost:8080, Vagrant forwards it to the guest port
    # where the webserver responds with the HTML page, and reply is sent back to the
    # host as if it came from localhost:8080
    webserver.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

    webserver.vm.network "private_network", ip: "192.168.56.11"

    webserver.vm.network "forwarded_port", guest: 22, host: 2203, auto_correct: true, id: "ssh"

    webserver.vm.synced_folder ".", "/vagrant", owner: "vagrant", group: "vagrant", mount_options: ["dmode=775,fmode=777"]

    webserver.vm.provision "shell", path: "build-frontend-vm.sh"
  end
end
