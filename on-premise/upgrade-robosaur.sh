#!/bin/bash

# upgrade-robosaur.sh is a shell script to simplified:
# 1. rename datasaur-robosaur folder
# 2. docker image tar file extraction
# 3. configurations backup
# first param will be the existing version
# second param will be the new version
# example: ./upgrade-robosaur.sh v-2-0-0 v-2-0-1
# please make sure the user run this script outside datasaur-robosaur-v-x-x-x directory

currentVersion=$1
newVersion=$2

cd datasaur-robosaur-$currentVersion
./down.sh
cd ..
mv datasaur-robosaur-$currentVersion datasaur-robosaur-$currentVersion-old
mkdir datasaur-robosaur-$newVersion && tar -zvxf datasaur-robosaur-$newVersion.tar.gz -C datasaur-robosaur-$newVersion --strip-components=1
cp datasaur-robosaur-$currentVersion-old/robosaur.env datasaur-robosaur-$newVersion/
cp -r datasaur-robosaur-$currentVersion-old/docker-config datasaur-robosaur-$newVersion/
cd datasaur-robosaur-$newVersion
./add-channel.sh 15
./add-channel.sh 16
./upgrade.sh