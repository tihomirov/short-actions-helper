'use strict';

const browserExtension = require('..');
const assert = require('assert').strict;

assert.strictEqual(browserExtension(), 'Hello from browserExtension');
console.info('browserExtension tests passed');
