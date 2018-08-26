'use strict';

let Mocha     = require('mocha'),
    argv      = require('yargs').argv,
    mocha     = new Mocha({ grep: argv.grep || '', timeout: 10000 }),
    casePath  = __dirname + '/cases/';

global.should  = require('chai').should();
global.expect  = require('chai').expect;
global.api     = require('supertest')(`https://dev.press.one`);
// global.api     = require('supertest')(`http://127.0.0.1:8090`);

global.fileHost = 'https://storage.googleapis.com/pressone';

global.user    = {
    email: 'test1@press.one',
    keystore: '{"address":"ee6ddad145f681fd5bd19eca003c9d204d214471","crypto":{"cipher":"aes-128-ctr","ciphertext":"c8f1317ad80d4702ea5589080d83adf3dd1b16ad830204a865f67a2b75d33c3f","cipherparams":{"iv":"3ac3a7e6c1914a3550c319861c5210ba"},"mac":"087795020c77bd306acb07597ea894b1f654178893783b619f5c8372b65a7720","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"017430a85e4dd61584ed0dcdc24545a2c647b993a2b347f42fa81322185f679f"}},"id":"59e94a3d-aa8b-4050-892e-f569b7be77a3","version":3}',
    password: 'nopassword', 
    address: 'ee6ddad145f681fd5bd19eca003c9d204d214471',
    privateKey: '16cf5d9cdc66927a24bec53d56e3b7640f6c2c39d2fd733975f7eb861a61a391',
    // must use valid mixin to withdraw and both of them have limitation for withdraw every day
    validMixinIds: [
        'c39c2ecc-2109-499f-b6c4-d6f278ea29fb',
        '96cb8b89-0808-427e-a58c-a04adb8119ce',
    ],
};

global.developer = {
    email: 'test2@press.one',
    keystore: '{"address":"86248535534919506cc130b21a32383cf36c5b6a","crypto":{"cipher":"aes-128-ctr","ciphertext":"61d44823cfbadd15d67aba4167fe561b423168c04e99e609f9613212577d50fb","cipherparams":{"iv":"cb83cc76bf8f388f705173182613a442"},"mac":"856d5fa3af2060bfc71b395487cd428302539565602a61b4921ca3a16592fd5e","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"6e023121e6934ae020438852d14214461171e2dce789e67d5472dd069fcd9eea"}},"id":"4cfd24f0-383a-469d-a65c-fe606af49f43","version":3}',
    password: 'nopassword', 
    address: '86248535534919506cc130b21a32383cf36c5b6a'
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
