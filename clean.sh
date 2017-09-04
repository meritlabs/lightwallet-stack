cd data-and-logs/data-1 
ls | grep -v bitcoin.conf | xargs rm -rf
cd ../data-2
ls | grep -v bitcoin.conf | xargs rm -rf
cd ../data-3
ls | grep -v bitcoin.conf | xargs rm -rf
cd ../../