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
SUBSCRIBE_KEY=
ENV="SUBSCRIBE_KEY=$SUBSCRIBE_KEY"
USER=root
OUT=/home/pi/openit-device/nodejs.log

echo SUBSCRIBE_KEY=$SUBSCRIBE_KEY

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
