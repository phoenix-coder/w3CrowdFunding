const { ethers } = require("hardhat");

async function main() {
  const [deployer1] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer1.address);

  console.log("Deploying Token(CLMN) Contract...");
  const Token = await ethers.getContractFactory("Token",deployer1);
  const token = await Token.deploy("Crowd Token", "CRT", 1000000000);
  await token.waitForDeployment();
  console.log(`Token(CRT) deployed to: ${await token.getAddress()} by ${deployer1.address}`);

  console.log("Deploying Token(CLMN) Contract...");
  const Crowd = await ethers.getContractFactory("CrowdFunding",deployer1);
  const crowd = await Crowd.deploy(await token.getAddress());
  await crowd.waitForDeployment();
  console.log(`Token(CRT) deployed to: ${await crowd.getAddress()} by ${deployer1.address}`);

}  

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});