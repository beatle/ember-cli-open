'use strict';

// var targetApp = 'test-target/some-app';
var targetApp = 'tests/dummy';

var Promise = require("rsvp").Promise;
var path = require('path');
var fs = require('fs');

var chai = require('chai');

var expect = chai.expect;

var runCommand = require('ember-cli-internal-test-helpers/lib/helpers/run-command');

var TIME_TO_WAIT_FOR_BUILD = 10000;
var TIME_TO_WAIT_FOR_STARTUP = 10000;

var _log = [];

function log(message) {
  _log.push(message);
}

function getOpenerLaunchedCount() {
    var filePath = path.join(process.cwd(), 'fake-opener');

    try { // if exists
      fs.accessSync(filePath);
    } catch (e) {
      return 0;
    }

    var fileContent = fs.readFileSync(filePath, { encoding:  'utf8' });

    return (fileContent.match(/launched/mg) || []).length;
}

function runServer(commandOptions) {
  if (!commandOptions.log) {
    commandOptions.log = log;
  }

  return new Promise(function(resolve, reject) {
    return runCommand(
      path.join('.', 'node_modules', 'ember-cli', 'bin', 'ember'),
      'serve',
      commandOptions.open ? '--open=true' : '',
      commandOptions
    )
      .then(function() {
        throw new Error('The server should not have exited successfully.');
      })
      .catch(function(err) {
        if (err.testingError) {
          return reject(err.testingError);
        }

        // This error was just caused by us having to kill the program
        return resolve();
      });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('commands/serve --open', function () {
  before(function() {
    this.timeout(300000);
    process.chdir(targetApp);
    return runCommand('bower', 'install', { log: log })
      .then(() => runCommand('npm', 'uninstall', 'ember-cli-open', { log: log }))
      .then(() => runCommand('npm', 'install', { log: log }))
      .then(() => runCommand('npm', 'install', '--save-dev', path.join('..', '..'), { log: log }));
  });

  beforeEach(function() {
    try {
      fs.unlinkSync('fake-opener');
    } catch (e) {
      // eslint-disable no-empty
      // don't know how to make without catch efectivelly
    }
  });

  it('opener should be launched', function() {
    this.timeout(TIME_TO_WAIT_FOR_BUILD + TIME_TO_WAIT_FOR_STARTUP);
    return runServer({
      open: true,
      killAfterChildSpawnedPromiseResolution: true,
      onChildSpawned: function () {
        return delay(TIME_TO_WAIT_FOR_BUILD).then(function () {
          var openerLaunchedCount = getOpenerLaunchedCount();
          expect(openerLaunchedCount).to.equal(1, "Opener launched 1 time");
        });
      }
    });
  });

  it('opener should not be launched', function () {
    this.timeout(TIME_TO_WAIT_FOR_BUILD + TIME_TO_WAIT_FOR_STARTUP);
    return runServer({
      open: false,
      onChildSpawned: function () {
        return delay(TIME_TO_WAIT_FOR_BUILD).then(function () {
          var openerLaunchedCount = getOpenerLaunchedCount();
          expect(openerLaunchedCount).to.equal(0, "Opener not launched");
        });
      },
      killAfterChildSpawnedPromiseResolution: true
    });
  });
});
