# resolve-alfred-prefs [![Build Status](https://travis-ci.org/SamVerschueren/resolve-alfred-prefs.svg?branch=master)](https://travis-ci.org/SamVerschueren/resolve-alfred-prefs)

> Resolve the path of `Alfred.alfredpreferences`


## Install

```
$ npm install resolve-alfred-prefs
```


## Usage

```js
const resolveAlfredPrefs = require('resolve-alfred-prefs');

(async () => {
	console.log(await resolveAlfredPrefs());
	//=> '/Users/sam/Dropbox/Alfred.alfredpreferences'
})();
```


## API

### resolveAlfredPrefs()

Returns a `Promise` for the `Alfred.alfredpreferences` path.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
