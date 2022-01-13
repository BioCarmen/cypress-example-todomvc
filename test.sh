#!/bin/bash

# 1) Fetch the current release version

echo "Fetch tags"
# git fetch --prune --tags

# get latest tag
t=$(git describe --tags `git rev-list --tags --max-count=1`)

echo $t

TODAY=`date +%y-%m-%d`
echo $TODAY
version="01"
new_tag="prod-$TODAY-$version"
echo $new_tag
# 3) Add git tag
echo "Add git tag $new_tag"
 git tag -a "$new_tag" -m "release $TODAY"

 # 4) Push the new tag
echo "Push the tag"
git push --tags origin develop