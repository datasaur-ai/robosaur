#!/bin/bash

set -e

dockerTag=$1

cd on-premise
echo "removing temporary folder"
rm -fr build
mkdir build

cp -r scheme/default/* ./build

cp ./../sample/rex/config_rex.json ./build/docker-config/config.json

export CI_REGISTRY=682361690817.dkr.ecr.us-east-1.amazonaws.com
export DOCKER_TAG=$dockerTag
echo ${dockerTag} > build/version

docker-compose -f docker-compose.build.yml build

echo "saving robosaur image"

docker save datasaur/robosaur:${dockerTag} | gzip > build/datasaur-robosaur.tar.gz
rm -r datasaur-robosaur-${dockerTag}
mv build datasaur-robosaur-${dockerTag}
echo "creating artifact"

ls -la datasaur-robosaur-${dockerTag}
echo "compressing above files"
tar -czf datasaur-robosaur-${dockerTag}.tar.gz datasaur-robosaur-${dockerTag}
rm -fr datasaur-robosaur-${dockerTag}
