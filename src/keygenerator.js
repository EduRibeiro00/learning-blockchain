const EC = require('elliptic').ec

// create new Elliptic instance in order to generate private and public keys
const ec = new EC('secp256k1')

// generate a key pair consisting of a private and public key
const key = ec.genKeyPair()
const publicKey = key.getPublic('hex')
const privateKey = key.getPrivate('hex')

console.log(`Private Key: ${privateKey}`)
console.log(`Public Key: ${publicKey}`)