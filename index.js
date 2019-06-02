'use strict';
const path = require('path');
const pify = require('pify');
const userHome = require('user-home');
const pathExists = require('path-exists');
const bplistParser = require('bplist-parser');
const untildify = require('untildify');

const bplist = pify(bplistParser);
const settings = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences.plist');

module.exports = async () => {
	const exists = await pathExists(settings);

	if (!exists) {
		throw new Error(`Alfred preferences not found at location ${settings}`);
	}

	const data = await bplist.parseFile(settings);
	const syncfolder = data[0].syncfolder || '~/Library/Application Support/Alfred';

	return untildify(`${syncfolder}/Alfred.alfredpreferences`);
};
