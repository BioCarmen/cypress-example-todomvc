#!/bin/bash

# 1) Fetch the current release version

echo "Fetch tags"
# git fetch --prune --tags

# get latest tag
t=$(git describe --tags `git rev-list --tags --max-count=1`)

echo $t

TODAY=`date +%y-%m-%d`
echo $TODAY
version=01
new_tag=`prod-$TODAY-$version`

  # 3) Add git tag
  echo "Add git tag v$nnew_tag"
  git tag -a "$new_tag" -m "release $TODAY"