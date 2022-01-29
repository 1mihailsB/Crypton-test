import { task } from "hardhat/config";
import getDonationContract from "./common";

task("get-donations", "Get amount donated from address.")
  .addParam("contract", 'Address of contract.')
  .addParam("donator", 'Address of donator.')
  .setAction(async (taskArgs, hre) => {
    const contract = await getDonationContract(taskArgs.contract);
    const amount : bigint = (await contract.getDonationsByAddress(taskArgs.donator)).toBigInt();
    console.log(`Amount donated by ${taskArgs.donator}: ${amount} Wei`);

    return amount;
});