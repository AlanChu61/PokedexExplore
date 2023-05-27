hostnamectl set-hostname aws
sed '1s/$/ aws/' -i /etc/hosts

export DEBIAN_FRONTEND=noninteractive
apt-get -y update
apt-get -y upgrade

apt-get install -y build-essential
add-apt-repository ppa:deadsnakes/ppa -y
apt-get update
apt-get install python3.8 -y

update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 1
update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.8 2

apt-get install python3-pip python3.8-dev -y
python3 -m pip install virtualenv
sh -c 'echo "export VIRTUALENV_PYTHON=/usr/bin/python3.8" > /etc/profile.d/virtualenv_python.sh'

sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
apt-get update
apt-get -y install postgresql-13 postgresql-client-13 postgresql-server-dev-13 libpq-dev

sudo -su postgres psql --command "CREATE USER ubuntu WITH SUPERUSER;"
sudo -su ubuntu createdb -O ubuntu ubuntu