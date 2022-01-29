import { task } from "hardhat/config";
import getDonationContract from "./common";

/**
 * param 'from' is any account of hre.ethers.getSigners(). Locally hre.ethers.getSigners() is
 * list of accounts create by npx hardhat node. For Rinkeby - hre.ethers.getSigners() is list
 * of accounts added in hardhat.config.ts in rinkeby.accounts node.
 */
task("donate", "Donate to the contract")
  .addParam("contract", 'Address of contract to which to donate.')
  .addParam("from", 'Address from which to donate.')
  .addParam('amount', 'Amount of Wei to donate')
  .setAction(async (taskArgs, hre) => {
    const contract = await getDonationContract(taskArgs.contract);
    const signers =  await hre.ethers.getSigners();
    const from = signers.find(signer => {
      return signer.address === taskArgs.from;
    });

    if (from === undefined) {
      throw new Error("'From' account not found");
    }

    const result = await contract.connect(from).donate({value: taskArgs.amount});
    console.log(result);
});