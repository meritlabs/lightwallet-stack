var envVarsModule = angular.module('envVarsModule', []);

envVarsModule.constant('MODULE_VERSION', '1.0.0');

// This provider is designed to get environment variables either from the node_env
// Or from a .env file in this directory.
envVarsModule.provider("envVarsService", function() {
  var provider = {};

  provider.$get = function() {
    var service = {};
    
    service.getVars = function() {
      var envVars = {};
      if (process.env.BWS_URL) {
        envVars.bwsUrl = process.env.BWS_URL;
      }  
      return envVars;
    }

    return service;
  }

  return provider;
});