#! /bin/bash

cd ~/Projects/Punch
git pull
docker-compose down
docker rmi mraddict063/punch
docker-compose up -d
