#!/bin/bash

# Update Ubuntu packages
apt-get update

# Root password for MySQL
export MYSQL_PWD='insecure_mysqlroot_pw'

# Pre-answer MySQL installer questions
echo "mysql-server mysql-server/root_password password $MYSQL_PWD" | debconf-set-selections 
echo "mysql-server mysql-server/root_password_again password $MYSQL_PWD" | debconf-set-selections

# Install MySQL server
apt-get -y install mysql-server
service mysql start

# Create database and user idempotently
mysql -u root -p"$MYSQL_PWD" <<SQL
CREATE DATABASE IF NOT EXISTS fvision;
CREATE USER IF NOT EXISTS 'webuser'@'%' IDENTIFIED BY 'insecure_db_pw';
GRANT ALL PRIVILEGES ON fvision.* TO 'webuser'@'%';
FLUSH PRIVILEGES;
SQL

# Enable LOCAL INFILE in MySQL config
if ! grep -q "local_infile=1" /etc/mysql/mysql.conf.d/mysqld.cnf; then
    echo "[mysqld]" >> /etc/mysql/mysql.conf.d/mysqld.cnf
    echo "local_infile=1" >> /etc/mysql/mysql.conf.d/mysqld.cnf
fi

# Update MySQL bind-address to allow external connections
sed -i'' -e '/bind-address/s/127.0.0.1/0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf
service mysql restart

# Set password for webuser
export MYSQL_PWD='insecure_db_pw'

mysql --local-infile=1 -u webuser -p"$MYSQL_PWD" fvision < /vagrant/setup-database.sql
