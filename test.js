'use strict';

let Mocha     = require('mocha'),
    argv      = require('yargs').argv,
    mocha     = new Mocha({ grep: argv.grep || '', timeout: 10000 }),
    casePath  = __dirname + '/cases/';

global.should  = require('chai').should();
global.expect  = require('chai').expect;
global.api     = require('supertest')(`https://dev.press.one`);
// global.api     = require('supertest')(`http://127.0.0.1:8090`);

global.key     = {
    privateKey   : '155ea514c5732524bcdf5c3801177d64644aedff027fbc9e1d36bf1731d96f46',
    publishKey   : '03be16beacefe2dbc4013e807af8ec574eccf1c7199e1b27cd64d279d725996da5',
    address      : '79e2b34b9d5d3346221ad82831c3c95e4be81288',
};

global.user    = {
    email        : 'test1@press.one',
    keystore     : '{"address":"ee6ddad145f681fd5bd19eca003c9d204d214471","crypto":{"cipher":"aes-128-ctr","ciphertext":"c8f1317ad80d4702ea5589080d83adf3dd1b16ad830204a865f67a2b75d33c3f","cipherparams":{"iv":"3ac3a7e6c1914a3550c319861c5210ba"},"mac":"087795020c77bd306acb07597ea894b1f654178893783b619f5c8372b65a7720","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"017430a85e4dd61584ed0dcdc24545a2c647b993a2b347f42fa81322185f679f"}},"id":"59e94a3d-aa8b-4050-892e-f569b7be77a3","version":3}',
    password     : 'nopassword',
    address      : 'ee6ddad145f681fd5bd19eca003c9d204d214471',
    validMixinId : 'c39c2ecc-2109-499f-b6c4-d6f278ea29fb',
};

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
