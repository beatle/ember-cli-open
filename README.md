# ember-cli-open

Opens ember-cli application in the browser.

## Usage
Run `ember open` command from within any of your ember-cli project to serve and open it in your browser.
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

TODO:
- [ ] `Open` when app is being served already

## Installation

```
npm i --save-dev https://github.com/ro0gr/ember-cli-opener
```

## Running

* `ember o`
* `ember open`
* `ember serve --auto-open=true`

## Running Tests

TODO

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
