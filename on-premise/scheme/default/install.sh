#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Installation started"
docker load --input ${DIR}/datasaur-robosaur.tar.gz
docker load --input ${DIR}/rabbitmq.tar.gz
echo "Installation finished"
