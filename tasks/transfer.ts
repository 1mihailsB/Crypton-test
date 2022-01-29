import { task } from "hardhat/config";
import getDonationContract from "./common";

task("transfer", "Transfer Ether from contract to account.")
  .addParam("contract", 'Address of contract from which to transfer.')
  .addParam("to", 'Address of contract to which to donate.')
  .addParam('amount', 'Amount of Wei to donate')
  .setAction(async (taskArgs, hre) => {
    const contract = await getDonationContract(taskArgs.contract);
    const result = await contract.tranferDonations(taskArgs.to, taskArgs.amount);
    console.log(result);
});