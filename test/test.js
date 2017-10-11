'use strict';

const test = require('ava');
const childProcess = require('child_process');

test('smoke-test', t => {
	t.plan(1);

	const cp = childProcess.spawn('node', ['cli.js'], {
		cwd: __dirname,
		stdio: 'inherit'
	});

	cp.on('error', err => {
		t.assert(!err, err);
	});

	cp.on('close', code => {
		t.assert(code === 0);
	});
});
