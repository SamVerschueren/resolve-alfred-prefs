'use strict';
const path = require('path');
const pify = require('pify');
const userHome = require('user-home');
const pathExists = require('path-exists');
const bplistParser = require('bplist-parser');
const untildify = require('untildify');

const bplist = pify(bplistParser);
const settingsV3 = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences-3.plist');
const settingsLatest = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences.plist');

module.exports = async () => {
	const latestExists = await pathExists(settingsLatest);
	const v3Exists = await pathExists(settingsV3);

	if (!(latestExists || v3Exists)) {
		throw new Error(`Alfred preferences not found at location ${settingsLatest} or ${settingsV3}`);
	}

	const settings = latestExists ? settingsLatest : settingsV3;

	const data = await bplist.parseFile(settings);
	const applicationSupportFolder = latestExists ? '~/Library/Application Support/Alfred' : '~/Library/Application Support/Alfred 3';
	const syncfolder = data[0].syncfolder || applicationSupportFolder;

	return untildify(`${syncfolder}/Alfred.alfredpreferences`);
};
