'use strict'

var lookupCommand = require('ember-cli/lib/cli/lookup-command')

module.exports = function runCommand (env, command, args) {
  var Command = lookupCommand(env.commands, command, args, {
    project: env.project,
    ui: env.ui
  })

  var cmd = new Command({
    ui: env.ui,
    analytics: env.analytics,
    commands: env.commands,
    tasks: env.tasks,
    project: env.project,
    settings: env.settings,
    testing: env.testing,
    cli: env.cli
  })

  cmd.beforeRun(args)
  return cmd.validateAndRun(args)
}
