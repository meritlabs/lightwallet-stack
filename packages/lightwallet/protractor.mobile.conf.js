const { config, browserStackCommon } = require('./protractor.common.conf');
const IS_CI = process.env.CIRCLECI || process.env.JENKINS_URL;

config.baseUrl = 'http://localhost:8100/';
config.specs = [
  './mobile/e2e/app.e2e-spec.ts',
  './mobile/e2e/**/*.e2e-spec.ts'
];

if (IS_CI) {
  config.multiCapabilities.push(
    {
      ...browserStackCommon,
      browserName: 'Chrome',
      chromeOptions: {
        mobileEmulation: {
          deviceName: 'Pixel 2'
        }
      }
    }
  );
} else {
  config.multiCapabilities.push(
    {
      device: 'Google Pixel',
      os_version: '8.0',
      real_mobile: true
    },
    {
      device: 'iPhone X',
      os_version: '11.0',
      real_mobile: true
    }
    // ,
    // {
    // browserName: 'chrome',
    // chromeOptions: {
    //   mobileEmulation: {
    //     deviceName: 'Pixel 2'
    //   },
    //   args: ['--touch-events=enabled']
    // }
  // }
  );
}

exports.config = config;
