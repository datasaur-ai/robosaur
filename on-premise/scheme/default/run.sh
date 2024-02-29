#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
set -e

export DOCKER_TAG=$(cat ${DIR}/version)
export CI_REGISTRY=682361690817.dkr.ecr.us-east-1.amazonaws.com

export $(grep -v '^#' ./robosaur.env | xargs) > /dev/null

docker compose --env-file ./robosaur.env -p robosaur up -d
