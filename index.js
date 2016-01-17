/* jshint node: true */
'use strict';
var opener = require("opener");
var cleanBaseURL = require("clean-base-url");

var displayHost = function(specifiedHost) {
  return specifiedHost || 'localhost';
};

module.exports = {
  name: 'ember-cli-open',

  urlToOpen: undefined,

  outputReady: function() {
    if (this.urlToOpen) {
      opener(this.urlToOpen);
    }
  },

  serverMiddleware: function(startOptions) {
    var opts = startOptions.options;

    // extracted from https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/server/express-server.js#L146
    var baseURL = cleanBaseURL(opts.baseURL);
    this.urlToOpen = 'http' + (opts.ssl ? 's' : '') +
      '://' + displayHost(opts.host) + ':' +
      opts.port + baseURL;
  }
};
