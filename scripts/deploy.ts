const { ethers } = require("hardhat");

async function main() {
  const [ deployer ] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const Donation = await ethers.getContractFactory("Donation");
  const donation = await Donation.deploy();

  await donation.deployed();

  console.log("Donation deployed to:", donation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
