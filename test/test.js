import path from 'path';
import fs from 'fs';
import test from 'ava';
import cp from 'cp-file';
import userHome from 'user-home';
import pify from 'pify';
import resolveAlfredPrefs from '..';

const settings = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences-3.plist');
const prefsJsonPath = path.join(userHome, '/Library/Application Support/Alfred/prefs.json');

const mv = (src, dest) => pify(fs.rename)(src, dest).catch(() => { });
const rm = file => pify(fs.unlink)(file);
const chmod = (file, mode) => pify(fs.chmod)(file, mode);

test.beforeEach(async () => {
	await mv(settings, `${settings}.back`);
	await mv(prefsJsonPath, `${prefsJsonPath}.back`);
});

test.afterEach(async () => {
	await mv(`${settings}.back`, settings);
	await mv(`${prefsJsonPath}.back`, prefsJsonPath);
});

test.serial('resolves `Alfred.alfredpreferences` path with Alfred 4 or newer', async t => {
	await cp(path.join(__dirname, 'fixtures/prefs.json'), prefsJsonPath);

	t.deepEqual(await resolveAlfredPrefs(), {
		path: '/Users/litomore/Library/Application Support/Alfred/Alfred.alfredpreferences'
	});

	await rm(prefsJsonPath);
});

test.serial('resolves `Alfred.alfredpreferences` path with Alfred 3', async t => {
	await cp(path.join(__dirname, 'fixtures/com.runningwithcrayons.Alfred-Preferences-3.plist'), settings);

	t.deepEqual(await resolveAlfredPrefs(), {
		version: 3,
		path: path.join(userHome, 'Documents/alfred/Alfred.alfredpreferences')
	});

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
