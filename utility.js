'use strict';

const ethUtil    = require('ethereumjs-util'),
      crypto     = require('crypto'),
      md5        = require('md5'),
      secp256k1  = require('secp256k1'),
      jsSha3     = require('js-sha3'),
      keythereum = require('keythereum'),
      ec         = new require('elliptic').ec('secp256k1');

const jsonApiPackage = (obj, address, privatekey) => {
    const message      = rollObject(obj);
    const signed_obj   = sign( message, privatekey);
    signed_obj.address = address;
    signed_obj.data    = obj;
    return signed_obj;
}

const getAuthHeader = (path, payload, _keystore, password) => {
    const keystore   = JSON.parse(_keystore);
    const address    = keystore.address;
    const privatekey = keythereum.recover(password, keystore);
    const auth       = jsonApiPackage({ path, payload }, address, privatekey);
    return {
        'Content-Type'      : 'application/json',
        'X-Po-Auth-Address' : address,
        'X-Po-Auth-Sig'     : auth.sig,
        'X-Po-Auth-Msghash' : auth.msghash
    };
}

const sign = (message, privatekey) => {
    const msghash = keccak256(message);
    return signByMsghash(msghash, privatekey);
}

const signByMsghash = (msghash, privatekey) => {
    const existingPrivKey =  ec.keyFromPrivate(privatekey , 'hex');
    const signature       = existingPrivKey.sign(msghash);
    const combinedHex     = signature.r.toString(16, 32)
                          + signature.s.toString(16, 32)
                          + signature.recoveryParam.toString();
    return {sig: combinedHex, msghash: msghash};
};

const getAuthSignature = (path, payload, _keystore, password) => {
    const keystore = JSON.parse(_keystore);
    const pkeyhex  = keythereum.recover(password, keystore);
    return signUtils.getAuthSignature(path, payload, pkeyhex);
}

const stringToUtf8ByteArray = str => {
    // TODO(user): Use native implementations if/when available
    let out = [], p = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        } else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        } else if (
            ((c & 0xFC00) === 0xD800) && (i + 1) < str.length &&
            ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        } else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
}

const base64ArrayBuffer = arrayBuffer => {
    let base64 = '';
    const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const bytes = new Uint8Array(arrayBuffer);
    const byteLength = bytes.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;
    let a;
    let b;
    let c;
    let d;
    let chunk;
    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i += 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63;        // 63       = 2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }
    // Deal with the remaining bytes and padding
    if (byteRemainder === 1) {
        chunk = bytes[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        base64 += `${encodings[a]}${encodings[b]}==`;
    } else if (byteRemainder === 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`;
    }
    return base64;
}

const getBase64str = (content) => {
    const utf8ByteArray = stringToUtf8ByteArray(content);
    const base64Str = base64ArrayBuffer(utf8ByteArray);
    return base64Str;
}

const signFile = (content, keystore, password) => {
    return signFileViaKey(
        content, keythereum.recover(password, JSON.parse(keystore))
    );
}

const signImage = (file, privatekey) => {
    const msghash = jsSha3.keccak256.update(file).toString('hex');
    return signByMsghash(msghash, privatekey);
  };

const signFileViaKey = (content, privatekey) => {
    const base64str = getBase64str(content);
    return sign(base64str, privatekey);
}

const signText = (text, keystore, password) => {
    const privatekey = keythereum.recover(password, JSON.parse(keystore));
    return sign(text, privatekey);
}

const rawRollObject = object => {
  let result = [];
  switch (Object.prototype.toString.call(object)) {
    case '[object Object]': {
      for (const i in object) {
        if (object.hasOwnProperty(i)) {
          const subVar = {};
          subVar[i] = rawRollObject(object[i]);
          result.push(subVar);
        }
      }
      result = result.sort((x, y) => {
          return Object.keys(x)[0] > Object.keys(y)[0] ? 1 : -1;
      });
      break;
    }
    case '[object Array]':
      for (const i in object) {
        if (object.hasOwnProperty(i)) {
          result.push(rawRollObject(object[i]));
        }
      }
      break;
    case '[object Date]':
      result = object.toISOString();
      break;
    default:
      result = object;
  }
  return result;
}

const rollObject = object => {
  return JSON.stringify(rawRollObject(object || {}));
}

let dumpKey = (buffer) => {
    return buffer.toString('hex');
};

let recoverKey = (string) => {
    return Buffer.from(string, 'hex');
};

let fetchKey = (buffer, options = {}) => {
    return options.dump ? dumpKey(buffer) : buffer;
};

let getPubaddressBySigAndMsghash = (sig, msghash) => {
    var v            = Number(sig.slice(128));
    var sigbuff      = recoverKey(sig.slice(0,128));
    var senderPubKey = secp256k1.recover(recoverKey(msghash), sigbuff, v);
    var publickey    = secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
    return dumpKey(ethUtil.pubToAddress(publickey));
};

let keccak256 = (message) => {
    return jsSha3.keccak256(message);
};

let sha256 = (string) => {
    return crypto.createHash('sha256').update(string, 'utf8').digest('hex');
};

let randomString = (count) => {
    let string  = '';
    for (let i  = 0; i < (count || 1); i++) {
        string += md5(String(Math.random()));
    }
    return string;
};

let createPrivateKey = (options = {}) => {
    let privateKey;
    do {
      privateKey = crypto.randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privateKey))
    return fetchKey(privateKey, options);
};

let createPublicKeyByPrivateKey = (privateKey, options = {}) => {
    return fetchKey(secp256k1.publicKeyCreate(privateKey), options);
};

let createKeyPair = (options = {}) => {
    let privateKey = createPrivateKey();
    let publishKey = createPublicKeyByPrivateKey(privateKey);
    let convertKey = secp256k1.publicKeyConvert(publishKey, false).slice(1);
    let publishAdd = ethUtil.pubToAddress(convertKey);
    return {
        privateKey : fetchKey(privateKey, options),
        publishKey : fetchKey(publishKey, options),
        address    : fetchKey(publishAdd, options),
    };
};

module.exports = {
    getAuthHeader,
    signFile,
    signFileViaKey,
    signImage,
    signText,
    getAuthSignature,
    rollObject,
    getPubaddressBySigAndMsghash,
    keccak256,
    sha256,
    randomString,
    createKeyPair,
};
