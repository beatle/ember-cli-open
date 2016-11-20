/*jshint node:true*/
/* global require, module */

var fs = require('fs');
var EOL = require('os').EOL;
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    open: {
      command: function(urlToOpen) {
        fs.appendFileSync('fake-opener',  urlToOpen + EOL, {
          flag: 'a'
        });
      }
    }
  });

  return app.toTree();
};
