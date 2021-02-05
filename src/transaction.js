const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

/**
 * Class representing a transaction, that can be contained inside a block.
 */
class Transaction {
    /**
     * Class constructor.
     * @param {*} fromAddress Address of the account that gives the ammount
     * @param {*} toAddress Address of the account that receives the ammount
     * @param {*} amount The ammount of the transaction
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }

    /**
     * Method that returns the hash value of the transaction, that will be signed.
     */
    calculateHash() {
        return SHA256(
            this.fromAddress + 
            this.toAddress +
            this.amount +
            this.timestamp
        ).toString()
    }

    /**
     * Method that will sign a transaction, given a certain pair of public and private keys.
     * @param {*} signingKeyPair Key pair (public and private) used to sign the transaction
     */
    signTransaction(signingKeyPair) {
        // check if public key is equal to the fromAddress in the transaction
        if (signingKeyPair.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!')
        }

        // create transaction hash
        const hash = this.calculateHash()
        // sign transaction hash
        const sig = signingKeyPair.sign(hash, 'base64')
        // store signature in transaction
        this.signature = sig.toDER('hex')
    }

    /**
     * Method that checks if a transaction is valid.
     */
    isValid() {
        // if transaction has no fromAddress (mining reward transaction), consider as valid
        if (this.fromAddress === null) return true

        // check if the transaction was signed or not
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction!')
        }

        // check if transaction was correctly signed by fromAddress
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }

}

module.exports = Transaction