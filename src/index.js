const Block = require('./block')
const Blockchain = require('./blockchain')

// creating new empty blockchain
let streamCoin = new Blockchain()

// adding and mining new blocks
console.log('Mining block 1...')
streamCoin.addBlock(new Block(1, "02/01/2020", { amount: 4 }))
console.log('Mining block 2...')
streamCoin.addBlock(new Block(2, "03/01/2020", { amount: 10 }))

// printing content
streamCoin.printContent()

// checking the validity of the blockchain
let valid = streamCoin.isChainValid() ? 'The chain is valid' : 'The chain is not valid'
console.log(valid)

// try to tamper with the blockchain
streamCoin.chain[1].data = { amount: 100 }
streamCoin.chain[1].hash = streamCoin.chain[1].calculateHash()

// checking validity again
valid = streamCoin.isChainValid() ? 'The chain is valid' : 'The chain is not valid'
console.log(valid)