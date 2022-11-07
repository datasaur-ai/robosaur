#!/bin/bash

set -e

dockerTag=$1

cd on-premise
rm -fr build
mkdir build

cp -r scheme/default/* ./build

cp ./../sample/rex/config_rex.json ./build

export CI_REGISTRY=682361690817.dkr.ecr.us-east-1.amazonaws.com
export DOCKER_TAG=$dockerTag

docker-compose -f docker-compose.build.yml build