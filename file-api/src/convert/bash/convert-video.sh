#!/bin/bash
set -e
set -u

# Call this script like this: 
# $ bash convert-video.sh <filename> <converter>

MY_PATH="`dirname \"$0\"`"
source "$MY_PATH/audiocodec.sh"

video=${1:-}

if [ -z $video ]; then
  echo "*** Missing argument <file>"
  exit 2
fi

if [ ! -f "$video" ]; then
  echo "*** Cannot find file $video"
  exit 2
fi

CONVERTER=${2:-}
if [ -z "$CONVERTER" ]; then
  echo "*** Missing argument <converter>"
  exit 2
fi

base_name=$(basename "$video" ".flv")
base_name=$(basename "$video" ".mkv")
date=`date +%Y-%m-%d`
output=$date-$base_name

# Run conversion
if [ "$CONVERTER" == "ffmpeg" ]; then
  CODECS=`$CONVERTER -codecs 2>&1`
  AUDIOCODEC_MP4=$(audiocodec "$CODECS")

  # ---> Converting to .mp4
  test -f "$output.mp4" || $CONVERTER -i "$video" -vcodec libx264 -acodec $AUDIOCODEC_MP4 -strict experimental -g 30 "$output.mp4"
  # ---> Converting to .webm
  test -f "$output.webm" || $CONVERTER -i "$video" -vcodec libvpx -acodec libvorbis -ab 160000 -f webm -g 30 "$output.webm"
elif [ "$CONVERTER" == "mencoder" ]; then #use mencoder
  # ---> Converting to .mp4
  test -f "$output.mp4" || $CONVERTER "$video" -of lavf -oac mp3lame -lameopts abr:br=128:q=0:mode=0 -ovc x264 -ofps 30 -o "$output.mp4"
  # ---> Converting to .webm
  test -f "$output.webm" || $CONVERTER -ovc lavc -oac lavc "$video" -lavfopts format=webm -ofps 30 -o "$output.webm"
else #use avconv
  # ---> Converting to .mp4
  test -f "$output.mp4" || $CONVERTER -i "$video" -vcodec libx264 -acodec libmp3lame "$output.mp4"
  # ---> Converting to .webm
  test -f "$output.webm" || $CONVERTER -i "$video" -c:v libvpx -c:a libvorbis "$output.webm"
fi

echo "$output.mp4"
echo "$output.webm"