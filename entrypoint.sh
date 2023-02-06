#!/bin/sh

# get the container IP
export IP=`ifconfig eth0 | grep 'inet ' | awk '{print $2}'`
export IP=`echo $IP | cut -d':' -f2`

# get the service name you specified in the docker-compose.yml 
# by a reverse DNS lookup on the IP
export APP_SERVICE=`dig -x $IP +short | cut -d'_' -f2`

# the number of replicas is equal to the A records 
# associated with the service name
export APP_COUNT=`dig $APP_SERVICE +short | wc -l`

# extract the replica number from the same PTR entry
export APP_INDEX=`dig -x $IP +short | sed 's/.*_\([0-9]*\)\..*/\1/'`
 
echo "Running producer $APP_INDEX of $APP_COUNT"

npm run start -- $COMMAND_NAME /home/robosaur/config/config.json
