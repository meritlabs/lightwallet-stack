const Cache = require('../schemes/cache.scheme');
var zmq = require('zmq');
const ENV = require('./../environment.js')[process.env.NODE_ENV];

class BlockchainMonitor {

    constructor() {

        const mongoose = require('mongoose');
        mongoose.connect(ENV.dbHost, {});
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

    }

    subscribe() {


        const socket = zmq.socket('sub');

        socket.on('connect', function(fd, endPoint) {
            console.info('ZMQ connected to:', endPoint);
        });

        socket.on('connect_delay', function(fd, endPoint) {
            console.warn('ZMQ connection delay:', endPoint);
        });

        socket.on('disconnect', function(fd, endPoint) {
            console.warn('ZMQ disconnect:', endPoint);
        });

        socket.on('monitor_error', function(err) {
            console.error('Error in monitoring: %s, will restart monitoring in 5 seconds', err);
            setTimeout(function() {
                socket.monitor(500, 0);
            }, 5000);
        });

        socket.monitor(500, 0);
        socket.connect('tcp://127.0.0.1:28332');

        socket.subscribe('hashblock');
        socket.subscribe('rawtx');
        socket.subscribe('rawreferraltx');
        socket.subscribe('hashreferraltx');

        socket.on('message', (topic, message) => {
            topic = topic.toString('utf8');
            if (topic == 'hashblock') {
                this.onIncomingBlock(message);
            } else {
                console.log(`Message with topic ${topic} handled in blockchain monitor. Left unhandled`);
            }
        })
    }


    async onIncomingBlock(message) {
        console.log(`New block received: ${message.toString('hex')}`);
        await Cache.collection.drop();
    }

}

module.exports = new BlockchainMonitor();