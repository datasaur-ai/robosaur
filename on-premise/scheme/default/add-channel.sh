#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
set -e

NAME=$1
CHANNEL_UID=$2
CHANNEL_GID=$3
cp -r ${DIR}/docker-folder-template ${DIR}/docker-logs-${NAME}
cp -r ${DIR}/docker-folder-template ${DIR}/docker-export-${NAME}
cp -r ${DIR}/docker-folder-template ${DIR}/docker-state-${NAME}

cat ${DIR}/template.txt >> ${DIR}/docker-compose.yml

sed -i 's/${NAME}/'${NAME}'/g' ${DIR}/docker-compose.yml
sed -i 's/${UID}/'${CHANNEL_UID}'/g' ${DIR}/docker-compose.yml
sed -i 's/${GID}/'${CHANNEL_GID}'/g' ${DIR}/docker-compose.yml
