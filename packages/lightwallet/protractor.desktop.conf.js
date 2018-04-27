const { config, browserStackCommon } = require('./protractor.common.conf');
const IS_CI = process.env.CIRCLECI || process.env.JENKINS_URL;

config.baseUrl = 'http://localhost:8888/';

if (IS_CI) {
  config.multiCapabilities.push(
    {
      ...browserStackCommon,
      browserName: 'Chrome'
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
  config.multiCapabilities.push({ browserName: 'chrome' });
}

exports.config = config;
