#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
set -e

export DOCKER_TAG=$(cat ${DIR}/version)

${DIR}/remove-image.sh
${DIR}/install.sh
