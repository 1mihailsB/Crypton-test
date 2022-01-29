import { task } from "hardhat/config";
import getDonationContract from "./common";

task("donators", "Get list of all donators.")
  .addParam("contract", 'Address of contract.')
  .setAction(async (taskArgs, hre) => {
    console.log('donators of contract', taskArgs.contract);
    const contract = await getDonationContract(taskArgs.contract);

    const donators : Array<string> = await contract.getAllDonators();
    console.log('Donators:', donators, '\nBalance:', (await hre.ethers.provider.getBalance(contract.address)).toBigInt());

    return donators;
});