#!/bin/bash
set -e
set -u

audiocodec() {
  for test in libvo_aacenc libvo_aac aac ; do
    echo $1 | grep -q $test && { echo $test ; exit ; }
  done
  echo ""
}