#!/bin/bash
set -e
set -u

audiocodec() {
  for test in libvo_aacenc libvo_aac aac ; do
    echo $1 | grep -q $test && { echo $test ; exit ; }
  done
  echo ""
}

if [ "$CONVERTER" == "ffmpeg" ]; then
  AUDIOCODEC_MP4=$(audiocodec "$CODECS")
  if [ -z $AUDIOCODEC_MP4 ] ; then
    echo "*** Prerequisities not met; ffpmeg setup problematic: none of (libvo_aacenc libvo_aac aac) found." 1>&2 ; exit 1;    
  fi
  echo "$AUDIOCODEC_MP4"
else
  echo ""  
fi