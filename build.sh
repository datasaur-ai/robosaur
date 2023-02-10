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

docker pull rabbitmq:3.11-management
docker save rabbitmq:3.11-management | gzip > build/rabbitmq.tar.gz

rm -rf datasaur-robosaur-${dockerTag}
mv build datasaur-robosaur-${dockerTag}
echo "creating artifact"

ls -la datasaur-robosaur-${dockerTag}
echo "compressing above files"
tar -czf datasaur-robosaur-${dockerTag}.tar.gz datasaur-robosaur-${dockerTag}
rm -fr datasaur-robosaur-${dockerTag}

# aws s3 cp datasaur-robosaur-${dockerTag}.tar.gz s3://datasaur-on-premise/bca/datasaur-robosaur-${dockerTag}.tar.gz
# aws s3 presign --expires-in=604800 s3://datasaur-on-premise/bca/datasaur-robosaur-${dockerTag}.tar.gz

gcloud storage cp ./datasaur-robosaur-${dockerTag}.tar.gz gs://djbc-demo-prod/datasaur-robosaur-${dockerTag}.tar.gz
