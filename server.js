const express = require('express')
const app = express();

const contractAbi = [
	{
		"inputs": [],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const providerURL = "http://127.0.0.1:8545/"

const {Web3} = require('web3')
const web3 = new Web3(providerURL)
const contract = new web3.eth.Contract(contractAbi, contractAddress)

async function getNumFromContract() {
	const result = await contract.methods.retrieve().call();
	console.log(result);
}
getNumFromContract()

app.get('/home',(req, res) => {
    res.send("Hey welcome to homepage")
})

app.listen(8080, (req, res) => {
    console.log("Server is running at http://127.0.0.1:8080")
})