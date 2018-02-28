const watchConfig = require('@ionic/app-scripts/config/watch.config.js');

console.log("IM ALIIIIVE')");

watchConfig.srcFiles.paths.push('{{ROOT}}/common/**/*.ts');

module.exports = watchConfig;
