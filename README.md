# ember-cli-open
[![Build Status](https://travis-ci.org/ro0gr/ember-cli-open.svg?branch=master)](https://travis-ci.org/ro0gr/ember-cli-open)

Opens ember-cli application in the browser.

## Usage
Run `open` command from within any of your ember-cli project to serve and open it in your browser.
```
$ ember open
```

### Auto Open on Serve
You can also enable auto-openning your project after `serve` command is completed by setting the `autoOpen` value to `true` in your `.ember-cli`:

```
{
  ...
  "disableAnalytics": false,
  "autoOpen": true
}
```

or by passing it via cli:

```
ember s --auto-open=true
```

## Installation

```
npm i --save-dev ember-cli-open
```

## Running

* `ember o`
* `ember open`
* `ember serve --auto-open=true`

## Running Tests

There are no tests currently here :/

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
