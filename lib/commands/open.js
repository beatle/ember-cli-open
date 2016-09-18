/* jshint node: true */
'use strict';

var runCommand = require('../utils/run-command');
var Command = require('ember-cli/lib/models/command');
var ServeCommandClass = require('ember-cli/lib/commands/serve');

// Currently the only goal of the `Open` command is to start serve task.
//
// Actually we do not open any browser here in this command because there is no way to determine whether serve command finished building and set up server.
// See here https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/serve.js#L60
//
// So all the `open` logics stored in the build lifecycle hooks for now.
module.exports = Command.extend({
  name: 'open',
  description: 'Opens ember-cli project in the browser. It supports the same set of options as a `Serve` command does.',
  aliases: ['o'],
  works: 'insideProject',

  // need to maintain exact the same options as for the Serve command
  availableOptions: ServeCommandClass.prototype.availableOptions,

  run: function(commandOptions, rawArgs) {
    this.settings = commandOptions;

    return runCommand(this, 'serve', rawArgs)
  }
});
