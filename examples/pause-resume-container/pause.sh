#!/bin/bash

function fetchContainerIds () {
  echo $(docker ps -q --no-trunc | tr "\n" "\n")
}

ids=$(fetchContainerIds)

for id in $ids
do
  docker pause $id
done
