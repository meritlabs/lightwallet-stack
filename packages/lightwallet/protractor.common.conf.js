const { SpecReporter } = require('jasmine-spec-reporter');
const IS_CI = process.env.CIRCLECI || process.env.JENKINS_URL;
const COMMIT = process.env.CIRCLE_SHA1 || process.env.GIT_COMMIT || 'LOCAL';

const config = {
  allScriptsTimeout: 11000,
  multiCapabilities: [],
  directConnect: true,
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

if (IS_CI) {
  const browserstack = require('browserstack-local');
  config.seleniumAddress = 'http://hub-cloud.browserstack.com/wd/hub';

  config.beforeLaunch = () => {
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ key: process.env.BROWSERSTACK_KEY }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');
        resolve();
      });
    });
  };

  config.afterLaunch = () => new Promise(resolve =>  {
    exports.bs_local.stop(resolve);
  });

  config.directConnect = false;
}

exports.browserStackCommon = {
  'browserstack.user': process.env.BROWSERSTACK_USER,
  'browserstack.key': process.env.BROWSERSTACK_KEY,
  'browserstack.local': true,
  'browserstack.localIdentifier': `${ process.env.CIRCLE_BUILD_NUM }_${ process.env.CIRCLE_WORKFLOW_ID }_${ process.env.CIRCLE_STAGE }`,
  resolution: '1920x1080',
  name: 'LightwalletStack-' + COMMIT
};

exports.config = config;
