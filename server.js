require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const fs = require("fs");
const { error } = require("console");
const cors = require("cors");

// Initialize the Express application
const app = express();
app.use(express.json());

// Enable CORS for the frontend
app.use(
  cors({
    origin: "http://localhost:6536",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Load sensitive data from the .env file
const providerURL = "http://127.0.0.1:8545/";
//const privateKey = process.env.PRIVATE_KEY;
const ownerAddress = process.env.OWNER_ADDRESS;
//const recipientAddress = process.env.RECIPIENT_ADDRESS;

// Connect to your local Hardhat node.
const web3 = new Web3(providerURL);

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const crowdAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const tokenAbi = JSON.parse(
  fs.readFileSync("./artifacts/contracts/Crowd.sol/Token.json", "utf-8")
).abi;
const crowdAbi = JSON.parse(
  fs.readFileSync("./artifacts/contracts/Crowd.sol/CrowdFunding.json", "utf-8")
).abi;

const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
const crowdContract = new web3.eth.Contract(crowdAbi, crowdAddress);

function stringifyBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

app.post("/register", async (req, res) => {
  try {
    const { title, description, deadline, target, userAddress } = req.body;
    if (!title) {
      return res
        .status(400)
        .send({ success: false, error: "Title is required" });
    }
    if (!description) {
      return res
        .status(400)
        .send({ success: false, error: "Description is required" });
    }
    if (!deadline) {
      return res
        .status(400)
        .send({ success: false, error: "Deadline is required" });
    }
    if (!target) {
      return res
        .status(400)
        .send({ success: false, error: "Target is required" });
    }
    if (!userAddress) {
      return res
        .status(400)
        .send({ success: false, error: "User Address is required" });
    }

    const tx = await crowdContract.methods
      .register(title, description, deadline, target)
      .send({ from: userAddress });
    res.send(stringifyBigInt({ success: true, transaction: tx }));
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.post("/generateToken", async (req, res) => {
  try {
    const { name, symbol, totalsupply } = req.body;
    if (!name && !symbol && !totalsupply) {
      return res
        .send(400)
        .send({ success: false, error: "Information required." });
    }

    const tx = await crowdContract.methods
      .generateToken(name, symbol, totalsupply)
      .send({ from: ownerAddress });
    res.send(stringifyBigInt({ success: true, transaction: tx }));
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.put("/approveRequest", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.send(400).send({ success: false, error: "Id required." });
    }

    const tx = await crowdContract.methods
      .approveRequest(id)
      .send({ from: ownerAddress });
    res.send(stringifyBigInt({ success: true, transaction: tx }));
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.post("/donate", async (req, res) => {
  try {
    const { id, amount, userAddress } = req.body;
    if (!id && !amount && !userAddress) {
      return res
        .send(400)
        .send({ success: false, error: "Information required." });
    }
    const valueInWei = web3.utils.toWei(amount.toString(), "ether");
    const tx = await crowdContract.methods
      .donate(id)
      .send({ from: userAddress, value: valueInWei });
    res.send(stringifyBigInt({ success: true, transaction: tx }));
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.get("/balance", async (req, res) => {
  const { address } = req.body; // Read address from query parameters

  if (!address) {
    return res
      .status(400)
      .json({ success: false, error: "Address query parameter is required." });
  }

  try {
    // Get the balance in Wei
    const balanceInWei = await web3.eth.getBalance(address);

    // Convert the balance from Wei to Ether
    const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");

    res.json({ success: true, address, balance: balanceInEther });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 6535;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
