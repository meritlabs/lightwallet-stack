getvariables () {
    source $HOME/.meritenv

    if [ -z ${meritdir+x} ]
    then 
        echo -n "Enter the meritd location and press [ENTER]: "
        read meritdir
        echo meritdir=$meritdir >> $HOME/.meritenv
    fi 
    if [ -z ${lwsdir+x} ]
    then 
        echo -n "Enter the lws bootstrap location and press [ENTER]: "
        read lwsdir
        echo lwsdir=$lwsdir >> $HOME/.meritenv
    fi 

}

writealiases() {
    echo alias m1="${meritdir}/src/merit-cli -conf=-conf=${lwsdir}data-and-logs/data-1/merit.conf" >> $aliasfile
    echo alias m2="${meritdir}/src/merit-cli -conf=-conf=${lwsdir}data-and-logs/data-2/merit.conf" >> $aliasfile
    echo alias m3="${meritdir}/src/merit-cli -conf=-conf=${lwsdir}data-and-logs/data-3/merit.conf" >> $aliasfile
    echo "Aliased M1, M2, and M3 for convenience."
    echo "Source ${aliasfile} or open a new shell"
}

createaliases() {
    getvariables    
    shopt -s expand_aliases

    echo "Creating your aliases now...."
    # echo -n "Enter where you want your aliasfile and press [ENTER]: (default): "
    read -e -p "Enter the location to write aliases to:" -i "$HOME/.bash.local" aliasfile
    writealiases
    # if [ -z ${aliasfile+x} ]
    # then
    #     aliasfile=$HOME/.bash.local 
    # fi 
} 

killmerit() {
    echo "Killing all meritd instances..."
    killall -9 meritd
} 


if pgrep -x "meritd" > /dev/null
then
    echo "Merit is already running Running.."
        while true; do
            read -p "Would you like to stop the merit daemons running? [Y/N]: " yn
            case $yn in
                [Yy]* ) killmerit; break;;
                [Nn]* ) break;;
                * ) echo "Please answer yes or no.";;
            esac
        done

    if command -v m1 >/dev/null 2>&1 || command -v m2 >/dev/null 2>&1 || command -v m2 >/dev/null 2>&1
    then 
        echo "Aliases M1-M3 exist, moving on..."
    else 

        while true; do
            read -p "No aliases exist.  Do you want to create them? [Y/N]: " yn
            case $yn in
                [Yy]* ) createaliases; break;;
                [Nn]* ) exit;;
                * ) echo "Please answer yes or no.";;
            esac
        done
    fi 
else
    echo "Starting MeritD..."    
    getvariables
    ${meritdir}/meritd -conf=${lwsdir}/data-and-logs/data-1/merit.conf -datadir=${lwsdir}/data-and-logs/data-1/ & 
    ${meritdir}/meritd -conf=${lwsdir}/data-and-logs/data-2/merit.conf -datadir=${lwsdir}/data-and-logs/data-2/ &
    # & ${meritdir}/meritd -conf=${lwsdir}/data-and-logs/data-3/merit.conf -datadir=${lwsdir}/data-and-logs/data-3/ && fg
    echo "Meritd started with following PIDs"    
    pgrep -x "meritd"
fi




