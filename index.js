/* jshint node: true */
'use strict';
var opener = require("opener");
var cleanBaseURL = require("clean-base-url");

var displayHost = function(specifiedHost) {
  return specifiedHost || 'localhost';
};

// extracted from https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/server/express-server.js#L146
var urlFromOptions = function(opts) {
  var baseURL = cleanBaseURL(opts.baseURL);

  var url = 'http' + (opts.ssl ? 's' : '') +
    '://' + displayHost(opts.host) +
    ':' + opts.port + baseURL;

  return url;
};

module.exports = {
  name: 'ember-cli-opener',

  urlToOpen: undefined,

  _openOnServe: undefined,

  _opened: undefined,

  outputReady: function() {
    if (this._openOnServe && !this._opened && this.urlToOpen) {
      opener(this.urlToOpen);
      this._opened = true;
    }
  },

  serverMiddleware: function(startOptions) {
    this._openOnServe = startOptions.options.autoOpen;
    this.urlToOpen = urlFromOptions(startOptions.options);
  },

  includedCommands: function() {
    return {
      rename: require('./lib/commands/open')
    };
  }
};
