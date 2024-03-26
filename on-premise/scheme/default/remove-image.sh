#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
set -e

docker rm datasaur-robosaur

export DOCKER_TAG=$(cat ${DIR}/version)

docker image rm datasaur/robosaur:${DOCKER_TAG}
