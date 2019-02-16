'use strict';

let Mocha     = require('mocha'),
    argv      = require('yargs').argv,
    mocha     = new Mocha({ grep: argv.grep || '', timeout: 10000 }),
    casePath  = __dirname + '/test/';

global.should  = require('chai').should();
global.expect  = require('chai').expect;
global.api     = require('supertest')(`https://stage.press.one`);

global.fileHost = 'https://storage.googleapis.com/pressone/';

require('fs').readdirSync(casePath).forEach((file) => {
    if (file.endsWith('.js')) {
        let path = `${casePath}${file}`;
        mocha.addFile(path);
    }
});

// Run the tests.
mocha.run((failures) => {
    process.exitCode = failures ? -1 : 0;  // exit with non-zero status if there were failures
});
