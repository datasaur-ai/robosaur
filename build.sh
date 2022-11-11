#!/bin/bash

set -e

dockerTag=$1

cd on-premise
rm -fr build
mkdir build

cp -r scheme/default/* ./build

mkdir ./build/docker-config
mkdir ./build/docker-state
mkdir ./build/docker-logs
cp ./../sample/rex/config_rex.json ./build/docker-config/config.json

export CI_REGISTRY=682361690817.dkr.ecr.us-east-1.amazonaws.com
export DOCKER_TAG=$dockerTag

docker-compose -f docker-compose.build.yml build

docker save datasaur/robosaur:${dockerTag} | gzip > build/datasaur-robosaur.tar.gz

echo ${dockerTag} > build/version
mv build datasaur-robosaur-${dockerTag}
tar -czf datasaur-robosaur-${dockerTag}.tar.gz datasaur-robosaur-${dockerTag}
rm -fr datasaur-robosaur-${dockerTag}
