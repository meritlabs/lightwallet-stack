const { config, browserStackCommon } = require('./protractor.common.conf');
const IS_CI = process.env.CIRCLECI || process.env.JENKINS_URL;

config.baseUrl = 'http://localhost:8100/';

if (IS_CI) {
  config.multiCapabilities.push(
    {
      ...browserStackCommon,
      browserName: 'Chrome',
      mobileEmulation: {
        deviceName: 'Pixel 2'
      }
    },
    {
      ...browserStackCommon,
      browserName: 'Safari',
      browser_version: '11.0',
      os: 'OS X',
      os_version: 'High Sierra'
    }
    ,
    {
      ...browserStackCommon,
      browserName: 'Firefox'
    }
  );
} else {
  config.multiCapabilities.push({
    browserName: 'chrome',
    chromeOptions: {
      mobileEmulation: {
        deviceName: 'Pixel 2'
      }
    }
  });
}

exports.config = config;
