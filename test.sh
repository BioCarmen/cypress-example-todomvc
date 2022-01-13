#!/bin/bash
# get latest tag
t=$(git describe --tags `git rev-list --tags --max-count=1`)

echo $t