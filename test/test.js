import path from 'path';
import fs from 'fs';
import test from 'ava';
import cp from 'cp-file';
import userHome from 'user-home';
import pify from 'pify';
import resolveAlfredPrefs from '..';

const settings = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences-3.plist');

const mv = (src, dest) => pify(fs.rename)(src, dest).catch(() => { });

test.before(async () => {
	await mv(settings, `${settings}.back`);
	await cp(path.join(__dirname, 'fixtures/com.runningwithcrayons.Alfred-Preferences-3.plist'), settings);
});

test.after(async () => {
	await mv(`${settings}.back`, settings);
});

test('resolves `Alfred.alfredpreferences` path', async t => {
	t.is(await resolveAlfredPrefs(), path.join(userHome, 'Documents/alfred/Alfred.alfredpreferences'));
});
