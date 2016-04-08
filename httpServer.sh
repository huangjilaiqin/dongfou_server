#! /bin/sh

start(){
    forever start -p . -o log/httpServerout.log -e log/httpServerError.log -a httpProtocols.js
}

stop(){
    forever stop -p . -o log/httpServerout.log -e log/httpServerError.log -a httpProtocols.js
}

restart(){
    stop
    start
}


if [ -z $1 ]
then
    echo 'Usage:  httpServer.sh start|stop|restart'
fi

case $1 in
    start)
        start
            ;;
    stop)
        stop
            ;;
    restart)
        restart
            ;;
esac
exit 0

