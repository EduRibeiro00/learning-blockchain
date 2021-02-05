const Block = require('./block')
const Transaction = require('./transaction')

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
        this.pendingTransactions = [] // transactions that are pending (not on any block), and will be added to the next block when it is created/mined
        this.miningReward = 100 // reward that someone gets for mining a single block
    }

    /**
     * Method that creates the Genesis block, the first (dummy) block of the blockchain.
     */
    createGenesisBlock() {
        return new Block(
            "01/01/2020", 
            []
        )
    }

    /**
     * Method that returns the latest block in the blockchain.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    /**
     * Method that will mine a new block and insert the pending transactions on it.
     * @param {*} miningRewardAddress Address that will mine the new block and thus receive the mining reward
     */
    minePendingTransactions(miningRewardAddress) {
        // create reward transaction for the address that mined it
        const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTransaction)

        // create new block
        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash)
        // mine it
        block.mineBlock(this.difficulty)
        // add to blockchain
        this.chain.push(block)
        // reset pending transactions
        this.pendingTransactions = []
    }

    /**
     * Method that receives a new transactions and adds it to the pending transactions list.
     * @param {*} transaction New transaction (that should be signed and valid)
     */
    addTransaction(transaction) {
        // check if fromAddress and toAddress are filled in
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include fromAddress and toAddress!')
        }

        // check if transaction is valid
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to blockchain!')
        }

        // check if transaction amount is valid
        if (transaction.amount <= 0) {
            throw new Error('Transaction amount needs to be higher than 0!')
        }

        this.pendingTransactions.push(transaction)
    }

    /**
     * Method that receives an account address and calculates the total balance of that account, given its transactions on the blocks.
     * @param {*} address Address to calculate the balance
     */
    getAddressBalance(address) {
        let balance = 0

        // loop through blockchain
        for (const block of this.chain) {
            // loop through block's transactions
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount
                }
            }
        }
        return balance
    }

    /**
     * Method that returns a boolean value indicating if the blockchain is in a valid state or not.
     */
    isChainValid() {
        // for every block in the blockchain...
        for (let i = 1; i < this.chain.length; i++) {
            // check if hash is correct
            if (this.chain[i].hash !== this.chain[i].calculateHash()) return false
            
            // check if all transactions of the block are valid
            if (!this.chain[i].hasValidTransactions()) return false

            // check if block is correctly linked to previous one
            if (this.chain[i].previousHash !== this.chain[i-1].hash) return false
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