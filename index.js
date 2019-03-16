'use strict';
const path = require('path');
const pify = require('pify');
const userHome = require('user-home');
const bplistParser = require('bplist-parser');
const untildify = require('untildify');

const bplist = pify(bplistParser);
const settings = path.join(userHome, '/Library/Preferences/com.runningwithcrayons.Alfred-Preferences-3.plist');

module.exports = async () => {
	let data;

	try {
		data = await bplist.parseFile(settings);
	} catch (error) {
		if (error.code === 'EACCES') {
			throw new Error(`Permission denied to read Alfred preferences at location ${settings}`);
		}

		if (error.code === 'ENOENT') {
			throw new Error(`Alfred preferences not found at location ${settings}`);
		}

		throw error;
	}

	const syncfolder = data[0].syncfolder || '~/Library/Application Support/Alfred 3';

	return untildify(`${syncfolder}/Alfred.alfredpreferences`);
};
