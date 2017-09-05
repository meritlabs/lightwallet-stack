basedir=`echo $PWD/${1##*/}`
pushd ../merit-bitcoin > /dev/null
alias bc1="$PWD/src/bitcoin-cli -conf=${basedir}data-and-logs/data-1/bitcoin.conf -datadir=${basedir}data-and-logs/data-1/"
alias bc2="$PWD/src/bitcoin-cli -conf=${basedir}data-and-logs/data-2/bitcoin.conf -datadir=${basedir}data-and-logs/data-1/"
alias bc3="$PWD/src/bitcoin-cli -conf=${basedir}data-and-logs/data-3/bitcoin.conf -datadir=${basedir}data-and-logs/data-1/"
popd > /dev/null
