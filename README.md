# COSC349 A1 - Three-VM Application

This project demonstrates a multi-VM application setup using Vagrant and VirtualBox. It includes a database server, a middleware server, and a webserver.

## Overview

### VMs and Their Roles

1. **dbserver (Database VM)**
   - IP: `192.168.56.12`
   - Purpose: Hosts the MySQL database (`fvision`) containing Fibonacci numbers.
   - Packages: `mysql-server`
   - Communicates with: Middleware server.

2. **middleware (Middleware VM)**
   - IP: `192.168.56.13`
   - Purpose: Hosts a Node.js server that queries the database and exposes an HTTP API (`/fib/:n`) for Fibonacci numbers.
   - Packages: `nodejs`, `npm`, `mysql2`.
   - Communicates with: Database server (reads Fibonacci numbers), Webserver (responds to HTTP requests).

3. **webserver (Frontend VM)**
   - IP: `192.168.56.11`
   - Purpose: Hosts the website and frontend that queries the middleware server via HTTP and displays results.
   - Packages: `apache2`.
   - Communicates with: Middleware server (HTTP requests).

### Networking

- **Private network:** All VMs are on `192.168.56.x` allowing VM-to-VM communication.
- **Port forwarding:**  
  - Host → Webserver: `127.0.0.1:8080 → 192.168.56.11:80` (HTTP)  
  - Host → Each VM: SSH (`2201`, `2202`, `2203` for dbserver, webserver, middleware respectively).  

### How They Interact

1. User accesses `http://localhost:8080` (webserver).
2. Webserver sends HTTP request to middleware server at `192.168.56.13:3000`.
3. Middleware server queries MySQL database at `192.168.56.12`.
4. Middleware returns JSON response to webserver.
5. Webserver renders the Fibonacci number to the user.

## Getting Started

1. Install **Vagrant** and **VirtualBox**.
2. Clone this repository.
3. Run `vagrant up` to provision all three VMs.
4. Access the web application at `http://localhost:8080`.

## Redeployment

1. Run `vagrant halt` to stop all running server
2. Start the VMS again via `vagrant up`
- Note you can start and stop individual servers, e.g. `vagrant halt webserver`

- Troubleshooting tip: `vagrant global-status --prune` removes references to VMs that no longer exist and can resolve port forwarding or networking conflicts.

## Notes for Developers

- All VMs share `/vagrant` folder for configuration files and scripts.
- Port forwarding uses unique host ports to avoid collisions. `auto_correct: true` ensures SSH ports are adjusted automatically if conflicts occur.
