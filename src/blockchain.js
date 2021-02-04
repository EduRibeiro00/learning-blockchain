const Block = require('./block')

/**
 * Class representing a blockchain, with various blocks.
 */
class Blockchain {
    /**
     * Constructor of the class.
     */
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2 // number of zeros a block hash needs to have in the beginning
    }

    /**
     * Method that creates the Genesis block, the first (dummy) block of the blockchain.
     */
    createGenesisBlock() {
        return new Block(
            0,
            "01/01/2020", 
            "Genesis Block"
        )
    }

    /**
     * Method that returns the latest block in the blockchain.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    /**
     * Method that adds a new block to the end of the blockchain.
     * @param {*} block New block to be added to the blockchain
     */
    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash
        block.mineBlock(this.difficulty)
        this.chain.push(block)
    }

    /**
     * Method that returns a boolean value indicating if the blockchain is in a valid state or not.
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                return false
            }

            if (this.chain[i].previousHash !== this.chain[i-1].hash) {
                return false
            }
        }
        return true
    }

    /**
     * Method that logs the blockchain content on the console.
     */
    printContent() {
        console.log(JSON.stringify(this, null, 4))
    }
}

module.exports = Blockchain