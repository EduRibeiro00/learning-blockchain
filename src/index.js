const Blockchain = require('./blockchain')
const Transaction = require('./transaction')
const EC = require('elliptic').ec
const ec = new EC('secp256k1')

// create private (secret) key
const myKey = ec.keyFromPrivate('5e5f01fcb73d1ea35b7cf25b285c7ceb01f8ba729a9e7316fcf0d7f75351db5d')
// create public key
const myWalletAddress = myKey.getPublic('hex')


// creating new empty blockchain
let streamCoin = new Blockchain()

// create and add transaction
const tx1 = new Transaction(myWalletAddress, 'another_public_key', 10)
tx1.signTransaction(myKey)
streamCoin.addTransaction(tx1)

// mine block to include transactions in blockchain
streamCoin.minePendingTransactions(myWalletAddress)

// check my address
console.log(`Balance of edu is: ${streamCoin.getAddressBalance(myWalletAddress)}`)

// check if chain is valid
console.log(`Is chain valid? ${streamCoin.isChainValid()}`)

// try to tamper with the chain; changing transaction amount from 10 to 1
streamCoin.chain[1].transactions[0].amount = 1

// check again if chain is valid
console.log(`Is chain valid? ${streamCoin.isChainValid()}`)