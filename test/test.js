import path from 'path';
import fs from 'fs';
import test from 'ava';
import cp from 'cp-file';
import userHome from 'user-home';
import pify from 'pify';
import resolveAlfredPrefs from '..';

const settings = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences-3.plist');

const mv = (src, dest) => pify(fs.rename)(src, dest).catch(() => { });
const rm = file => pify(fs.unlink)(file);
const chmod = (file, mode) => pify(fs.chmod)(file, mode);

test.before(async () => {
	await mv(settings, `${settings}.back`);
});

test.after(async () => {
	await mv(`${settings}.back`, settings);
});

test.serial('resolves `Alfred.alfredpreferences` path', async t => {
	await cp(path.join(__dirname, 'fixtures/com.runningwithcrayons.Alfred-Preferences-3.plist'), settings);

	t.is(await resolveAlfredPrefs(), path.join(userHome, 'Documents/alfred/Alfred.alfredpreferences'));

	await rm(settings);
});

test.serial('throws an error if the preferences file does not exist', async t => {
	await t.throwsAsync(resolveAlfredPrefs, /Alfred preferences not found at location/);
});

test.serial('throws an error if accessing the preferences file is forbidden', async t => {
	await cp(path.join(__dirname, 'fixtures/com.runningwithcrayons.Alfred-Preferences-3.plist'), settings);
	// Remove read permissions.
	await chmod(settings, 0o200);

	await t.throwsAsync(resolveAlfredPrefs, /Permission denied to read Alfred preferences at location/);

	await rm(settings);
});
