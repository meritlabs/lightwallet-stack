basedir=`echo $PWD/${1##*/}`
cd ../merit/src
./meritd -conf=${basedir}data-and-logs/data-1/merit.conf -datadir=${basedir}data-and-logs/data-1/ 
# & ./meritd -conf=${basedir}data-and-logs/data-3/merit.conf -datadir=${basedir}data-and-logs/data-3/ && fg
# & ./meritd -conf=${basedir}data-and-logs/data-2/merit.conf -datadir=${basedir}data-and-logs/data-2/ 

alias bc1=./src/merit-cli -conf=-conf=${basedir}data-and-logs/data-1/merit.conf 
alias bc2=./src/merit-cli -conf=-conf=${basedir}data-and-logs/data-2/merit.conf 
alias bc3=./src/merit-cli -conf=-conf=${basedir}data-and-logs/data-3/merit.conf 

