import path from 'path';
import fs from 'fs';
import test from 'ava';
import cp from 'cp-file';
import userHome from 'user-home';
import pify from 'pify';
import m from '../';

const settings = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences-3.plist');

const mv = (src, dest) => pify(fs.rename)(src, dest).catch(() => { });

test.before(async () => {
	await mv(settings, `${settings}.back`);
	await cp('./fixtures/com.runningwithcrayons.Alfred-Preferences-3.plist', settings);
});

test.after(async () => {
	await mv(`${settings}.back`, settings);
});

test(async t => {
	t.is(await m(), path.join(userHome, 'Documents/alfred/Alfred.alfredpreferences'));
});
