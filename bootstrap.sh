basedir=`echo $PWD/${1##*/}`
cd ../merit-bitcoin-referrals/src
./bitcoind -conf=${basedir}data-1/bitcoin.conf -datadir=${basedir}data-1/ & ./bitcoind -conf=${basedir}data-3/bitcoin.conf -datadir=${basedir}data-3/ && fg
# & ./bitcoind -conf=${basedir}data-2/bitcoin.conf -datadir=${basedir}data-2/ 

alias bc1=./src/bitcoin-cli -conf=-conf=${basedir}data-1/bitcoin.conf 
alias bc2=./src/bitcoin-cli -conf=-conf=${basedir}data-2/bitcoin.conf 
alias bc3=./src/bitcoin-cli -conf=-conf=${basedir}data-3/bitcoin.conf 

