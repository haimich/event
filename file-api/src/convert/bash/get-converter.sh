#!/bin/bash
set -e
set -u

MY_PATH="`dirname \"$0\"`"
source "$MY_PATH/audiocodec.sh"

# Prerequisities
if hash ffmpeg 2> /dev/null; then
  CONVERTER=${CONVERTER-ffmpeg}
elif hash mencoder 2> /dev/null; then
  CONVERTER=${CONVERTER-mencoder}
elif hash avconv 2> /dev/null; then
  CONVERTER=${CONVERTER-avconv}
else 
  echo "please install ffmpeg, mencoder or avconv." 1>&2 ; exit 1;
fi

type $CONVERTER >/dev/null 2>&1 || { echo "The chosen converter $CONVERTER can not be found on your system." 1>&2 ; exit 1; }

if [ "$CONVERTER" == "ffmpeg" ]; then
  CODECS=`$CONVERTER -codecs 2>&1`
  echo $CODECS | grep -q libx264 || {
    echo "*** Prerequisities not met; ffpmeg setup problematic: libx264 not found." 1>&2 ; exit 1;
  }

  AUDIOCODEC_MP4=$(audiocodec "$CODECS")
  if [ -z $AUDIOCODEC_MP4 ] ; then
    echo "*** Prerequisities not met; ffpmeg setup problematic: none of (libvo_aacenc libvo_aac aac) found." 1>&2 ; exit 1;    
  fi
fi

echo $CONVERTER