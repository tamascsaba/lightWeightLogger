# LeightWeight Workout Logger

LeightWeight workout logger NodeJS & MongoDB telepítése szükséges a futtatáshoz.

## Telepítés
    sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential python-software-properties python g++ make
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get -y update
    sudo apt-get install nodejs

    apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10
    echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list.d/10gen.list
    apt-get -y update
    apt-get install mongodb-10gen

    npm install
    npm start
