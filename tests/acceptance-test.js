'use strict';

// var targetApp = 'test-target/some-app';
var targetApp = 'tests/dummy';

var Promise = require("rsvp").Promise;
var EOL = require("os").eol;
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

function cleanFakeOpener() {
    try {
      fs.unlinkSync('fake-opener');
    } catch (e) {
      // eslint-disable no-empty
      // don't know how to make without catch efectivelly
    }
}

function getOpenerLaunches() {
    var filePath = path.join(process.cwd(), 'fake-opener');

    try { // if exists
      fs.accessSync(filePath);
    } catch (e) {
      return [];
    }

    var fileContent = fs.readFileSync(filePath, { encoding:  'utf8' });

    var lines = fileContent.split(EOL)
      .map(function(line) { return line.trim(); })
      .filter(function(line) { return !!line; });

    return lines;
}

function runServer(commandOptions) {
  if (!commandOptions.log) {
    commandOptions.log = log;
  }
  commandOptions.killAfterChildSpawnedPromiseResolution = true;

  var openValue;
  if (typeof commandOptions.open !== 'undefined') {
    if (typeof commandOptions.open === 'boolean') {
      openValue = commandOptions.open ? "true" : "false";
    } else {
      openValue = commandOptions.open;
    }
    delete commandOptions.open;
  }

  return new Promise(function(resolve, reject) {
    return runCommand(
      path.join('.', 'node_modules', 'ember-cli', 'bin', 'ember'),
      'serve',
      openValue ? ('--open=' + openValue) : '',
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

describe('commands/serve', function () {
  before(function() {
    this.timeout(300000);
    process.chdir(targetApp);
    return runCommand('bower', 'install', { log: log })
    .then(() => runCommand('npm', 'uninstall', 'ember-cli-open', { log: log }))
    .then(() => runCommand('npm', 'install', { log: log }))
    .then(() => runCommand('npm', 'install', '--save-dev', path.join('..', '..'), { log: log }));
  });

  after(function() {
    process.chdir(path.join('..', '..'));
  }),

  beforeEach(cleanFakeOpener);

  it('should be launched by default', function() {
    this.timeout(TIME_TO_WAIT_FOR_BUILD + TIME_TO_WAIT_FOR_STARTUP);
    return runServer({
      onChildSpawned: function () {
        return delay(TIME_TO_WAIT_FOR_BUILD).then(function () {
          var launches = getOpenerLaunches();
          expect(launches.length).to.equal(1, "Opener launched 1 time");
        });
      }
    });
  });

  it('should not be launched if open=false', function () {
    this.timeout(TIME_TO_WAIT_FOR_BUILD + TIME_TO_WAIT_FOR_STARTUP);
    return runServer({
      open: false,
      onChildSpawned: function () {
        return delay(TIME_TO_WAIT_FOR_BUILD).then(function () {
          var launches = getOpenerLaunches();
          expect(launches.length).to.equal(0, "Opener not launched");
        });
      }
    });
  });
});

describe('commands/serve with baseURL', function () {
  before(function() {
    this.timeout(300000);
    process.chdir('tests/dummy.with-base-url');
    return runCommand('bower', 'install', { log: log })
    .then(() => runCommand('npm', 'uninstall', 'ember-cli-open', { log: log }))
    .then(() => runCommand('npm', 'install', { log: log }))
    .then(() => runCommand('npm', 'install', '--save-dev', path.join('..', '..'), { log: log }));
  });

  after(function() {
    process.chdir(path.join('..', '..'));
  }),

  beforeEach(cleanFakeOpener);

  it('should be launched by default', function() {
    this.timeout(TIME_TO_WAIT_FOR_BUILD + TIME_TO_WAIT_FOR_STARTUP);
    return runServer({
      onChildSpawned: function () {
        return delay(TIME_TO_WAIT_FOR_BUILD).then(function () {
          var launches = getOpenerLaunches();
          expect(launches.length).to.equal(1, "Opener launched 1 time");
          expect(launches[0]).to.equal('http://localhost:4200/custom-path/', "Opened with baseURL");
        });
      }
    });
  });
});
