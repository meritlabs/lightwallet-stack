// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

const config = {
  allScriptsTimeout: 11000,
  specs: [
    './desktop/e2e/**/*.e2e-spec.ts'
  ],
  multiCapabilities: [],
  directConnect: true,
  baseUrl: 'http://localhost:8888/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};

const IS_CI = process.env.CIRCLECI || process.env.JENKINS_URL;

if (IS_CI) {
  const COMMIT = process.env.CIRCLE_SHA1 || 'LOCAL';
  const browserstack = require('browserstack-local');
  config.seleniumAddress = 'http://hub-cloud.browserstack.com/wd/hub';

  config.beforeLaunch = () => {
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': process.env.BROWSERSTACK_KEY }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');
        resolve();
      });
    });
  };

  config.afterLaunch = () => new Promise(function(resolve, reject){
    exports.bs_local.stop(resolve);
  });

  const common = {
    'browserstack.user': process.env.BROWSERSTACK_USER,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    'browserstack.local': true,
    resolution: '1920x1080',
    name: 'LightwalletStack-' + process.env.GIT_COMMIT
  };

  config.multiCapabilities.push(
    {
      ...common,
      browserName: 'Chrome'
    },
    {
      ...common,
      browserName: 'Safari',
      browser_version: '11.0',
      os: 'OS X',
      os_version: 'High Sierra'
    },
    {
      ...common,
      browserName: 'Firefox'
    }
  );
  config.directConnect = false;
} else {
  config.multiCapabilities.push({ browserName: 'chrome' });
}

exports.config = config;
