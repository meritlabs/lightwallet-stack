const { execSync } = require('child_process');

while (true) {
    execSync('/var/merit/merit/src/merit-cli -conf=/var/merit/lightwallet-stack/data-and-logs/data-1/merit.conf generate 1') ;
    console.log('.');
}
