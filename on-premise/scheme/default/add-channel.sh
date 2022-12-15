#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

NAME=$1
cp -r ${DIR}/docker-config ${DIR}/docker-config-${NAME}
cp -r ${DIR}/docker-logs ${DIR}/docker-logs-${NAME}
cp -r ${DIR}/docker-export ${DIR}/docker-export-${NAME}
cp -r ${DIR}/docker-state ${DIR}/docker-state-${NAME}

cat ${DIR}/template.txt >> ${DIR}/docker-compose.yml

sed -i '' 's/${NAME}/'${NAME}'/g' ${DIR}/docker-compose.yml
