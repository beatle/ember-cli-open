/* jshint node: true */
'use strict';
var opener = require("opener");
var cleanBaseURL = require("clean-base-url");

var displayHost = function(specifiedHost) {
  return specifiedHost || 'localhost';
};

var urlFromOptions = function(options) {
  var rootURL;
  if ('baseURL' in options) {
    rootURL = options.baseURL === '' ? '/' : cleanBaseURL(options.baseURL);
  } else {
    rootURL = options.rootURL === '' ? '/' : cleanBaseURL(options.rootURL);
  }

  // extracted from https://github.com/ember-cli/ember-cli/blob/250987ec659201056f17f69482466b5360e03853/lib/tasks/server/express-server.js#L147
  var url = 'http' + (options.ssl ? 's' : '') +
    '://' + displayHost(options.host) +
    ':' + options.port + rootURL;

  if (typeof options.open === 'string') {
    // remove leading slash cause rootURL contains a trailing one
    url += options.open.replace(/^\//, '');
  }

  return url;
};

module.exports = {
  name: 'ember-cli-opener',

  urlToOpen: undefined,

  _openOnServe: undefined,

  _opened: undefined,

  included: function (app) {
    this._super.included.apply(this, arguments);
    this.options = app.options.open || {};
  },

  outputReady: function() {
    if (this._openOnServe && !this._opened && this.urlToOpen) {
      var openerCommand = typeof this.options.command === 'function' ?
        this.options.command :
        opener;

      openerCommand(this.urlToOpen);

      this._opened = true;
    }
  },

  serverMiddleware: function(startOptions) {
    if (typeof startOptions.options.open === 'undefined') {
      startOptions.options.open = true;
    }

    this._openOnServe = startOptions.options.open;
    // need test for rootURL and port
    this.urlToOpen = urlFromOptions(startOptions.options);
  },

  includedCommands: function() {
    return {
      open: require('./lib/commands/open')
    };
  }
};
