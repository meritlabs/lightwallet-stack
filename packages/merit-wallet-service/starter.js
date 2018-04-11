const ENV = require('./environment.js')[process.env.NODE_ENV];

/** clustering and starting the app */
const cluster = require('cluster');
const numCPUs = require('os').cpus().length; //todo add cluster config

if (cluster.isMaster) {
    console.log(`Master started (pid: ${process.pid})`);
    console.log(`Listening on port ${ENV.mwsPort}`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const app = require('./app');
    app.listen(ENV.mwsPort, () => console.log(`Worker started (pid: ${process.pid})`));
}