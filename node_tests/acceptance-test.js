'use strict';

var Promise = require("rsvp").Promise;
var path = require('path');
var fs = require('fs');

var chai = require('chai');

var expect = chai.expect;

var runCommand = require('ember-cli-internal-test-helpers/lib/helpers/run-command');

var targetApp = 'test-target/some-app';

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
      commandOptions.autoOpen ? '--autoOpen=true' : '',
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
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

describe('commands/serve --autoOpen', function () {
  before(function() {
    this.timeout(300000);
    process.chdir(targetApp);

    return runCommand('bower', 'install', { log: log })
      .then(function() {
        return runCommand('npm', 'uninstall', 'ember-cli-open', { log: log });
      })
      .then(function() {
        return runCommand('npm', 'install', { log: log });
      })
      .then(function() {
        return runCommand('npm', 'install', '--save-dev', path.join('..', '..'), { log: log });
      });
  });

  beforeEach(function() {
    try {
      fs.unlinkSync('fake-opener');
    } catch (e) {
    }
  });

  it('opener should be launched', function () {
    this.timeout(50000);
    return runServer({
      autoOpen: true,
      killAfterChildSpawnedPromiseResolution: true,
      onChildSpawned: function () { return delay(25000).then(function () {
          var openerLaunchedCount = getOpenerLaunchedCount();
          expect(openerLaunchedCount).to.equal(1, "Opener launched 1 time");
        });
      }
    });
  });

  it('opener should not be launched', function () {
    this.timeout(50000);
    return runServer({
      autoOpen: false,
      onChildSpawned: function () {
        return delay(25000).then(function () {
          var openerLaunchedCount = getOpenerLaunchedCount();
          expect(openerLaunchedCount).to.equal(0, "Opener not launched");
        });
      },
      killAfterChildSpawnedPromiseResolution: true
    });
  });
});
