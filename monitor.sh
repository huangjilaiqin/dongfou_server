
start(){
    forever start -p . -o log/jkout.log -e log/jkerror.log -a monitor.js
}

stop(){
    forever stop -p . -o log/jkout.log -e log/jkerror.log -a monitor.js
}

restart(){
    stop
    start
}

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

