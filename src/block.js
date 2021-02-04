const SHA256 = require('crypto-js/sha256')

/**
 * Class representing a blockchain block.
 */
class Block {
    /**
     * Class constructor.
     * @param {*} index Optional. Indicates where the block is situated in the chain
     * @param {*} timestamp Indicates when the block was created
     * @param {*} data Data inside the block
     * @param {*} previousHash Hash of the previous block in the blockchain, if any
     */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0 // random value used to calculate the block hash, so that every time we calculate the hash, a different value is given
    }

    /**
     * Method that calculates the hash for a specific block. Uses SHA-256.
     */
    calculateHash() {
        const hash = SHA256(
            this.index +
            this.previousHash + 
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString()

        // increment nonce; this way next time we compute the hash, we will get a different value
        this.nonce++

        return hash
    }

    /**
     * Method that performs what is known as mining or proof-of-work: it will try to calculate different
     * hashes for this block, in order to find a hash that begins with a certain numbers of zeros.
     * @param {*} difficulty Number of zeros that the hash of the block needs to have in the beginning
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.hash = this.calculateHash()
        }
        console.log(`Block mined: ${this.hash}`)
    }
}

module.exports = Block