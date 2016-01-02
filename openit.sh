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
SOURCE_DIR=/home/pi/openit-device
NODE_SCRIPT=app.js
OUT=/home/pi/openit-device/openit.log
PIDFILE=/var/run/openit.pid

export SUBSCRIBE_KEY=
echo SUBSCRIBE_KEY=$SUBSCRIBE_KEY

case "$1" in

start)
	echo "starting node: $NODE $SERVER_JS_FILE"
	exec forever --sourceDir=$SOURCE_DIR -a -l $OUT -p $PIDFILE --minUptime=5000 --spinSleepTime=2000 start $NODE_SCRIPT
	;;

stop)
	exec forever stop --sourceDir=$SOURCE_DIR NODE_SCRIPT
	;;

*)
	echo "Usage: /etc/init.d/openit.sh (start|stop)"
  exit 1
  ;;
esac

exit 0
