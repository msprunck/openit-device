#!/bin/bash
### BEGIN INIT INFO
# Provides:          openit
# Required-Start:    $remote_fs $syslog $network
# Required-Stop:     $remote_fs $syslog $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: openit initscript
# Description:       openit initscript
### END INIT INFO

NODE=/opt/node/bin/node
SERVER_JS_FILE=/home/pi/openit-device/app.js
OPENIT_DEVICE_ID= 
OPENIT_KEY=
ENV="OPENIT_DEVICE_ID=$OPENIT_DEVICE_ID OPENIT_KEY=$OPENIT_KEY"
USER=root
OUT=/home/pi/openit-device/nodejs.log

echo OPENIT_DEVICE_ID=$OPENIT_DEVICE_ID
echo OPENIT_KEY=$OPENIT_KEY

case "$1" in

start)
	echo "starting node: $NODE $SERVER_JS_FILE"
	sudo -u $USER $ENV $NODE $SERVER_JS_FILE > $OUT 2>$OUT &
	;;

stop)
	killall $NODE
	;;

*)
	echo "usage: $0 (start|stop)"
esac

exit 0
