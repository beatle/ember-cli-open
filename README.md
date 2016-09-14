# ember-cli-open

[![Build Status](https://travis-ci.org/ro0gr/ember-cli-open.svg?branch=master)](https://travis-ci.org/ro0gr/ember-cli-open)

Automatically opens `ember-cli` application in your default browser.

## Usage
Run `open` command from within any of your ember-cli project to serve and open it in your browser.
```
$ ember o[pen]
```

### Auto Open on Serve
Set `open` option value to `true` in your `.ember-cli` to open application on `serve` by default:
{
  ...
  "open": true
}
```

## Installation

```
npm i --save-dev ember-cli-open
```

## Running

* `ember open`
* `ember serve --open=true`

## Running Tests

Run `npm test`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
