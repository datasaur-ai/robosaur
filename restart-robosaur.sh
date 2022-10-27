#!/bin/bash

docker stop robosaur_robosaur_1
docker stop robosaur_mongodb_1
docker-compose up -d
