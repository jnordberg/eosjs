import {ec as EC} from 'elliptic';
import * as hash from 'hash.js';
import {KeyType} from './eosjs-numeric';
import { PublicKey } from './PublicKey';
import { PrivateKey } from './PrivateKey';

export { PrivateKey } from './PrivateKey';
export { PublicKey } from './PublicKey';
export { Signature } from './Signature';

/** Construct the elliptic curve object based on key type */
export const constructElliptic = (type: KeyType): EC => {
    if (type === KeyType.k1) {
        return new EC('secp256k1') as any;
    }
    return new EC('p256') as any;
};

export const generateKeyPair = (type: KeyType, options?: EC.GenKeyPairOptions):
    {publicKey: PublicKey, privateKey: PrivateKey} => {
    if (process.env.EOSJS_KEYGEN_ALLOWED !== 'true') {
        throw new Error('Key generation is completely INSECURE in production environments in the browser. ' +
            'If you are absolutely certain this does NOT describe your environment, add an environment variable ' +
            '`EOSJS_KEYGEN_ALLOWED` set to \'true\'.  If this does describe your environment and you add the ' +
            'environment variable, YOU DO SO AT YOUR OWN RISK AND THE RISK OF YOUR USERS.');
    }
    let ec;
    if (type === KeyType.k1) {
        ec = new EC('secp256k1') as any;
    } else {
        ec = new EC('p256') as any;
    }
    const ellipticKeyPair = ec.genKeyPair(options);
    const publicKey = PublicKey.fromElliptic(ellipticKeyPair, type, ec);
    const privateKey = PrivateKey.fromElliptic(ellipticKeyPair, type, ec);
    return {publicKey, privateKey};
};

export const sha256 = (data: string|Buffer) => {
    return hash.sha256().update(data).digest();
};
