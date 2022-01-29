import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Donation", function () {
  let contract: Contract;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  const correctTestValue = 333;
  const invalidTestValue = 0;

  const donateSevenTimes = async () => {
    await Promise.all([
      contract.connect(owner).donate({value: correctTestValue}),
      contract.connect(owner).donate({value: correctTestValue}),
      contract.connect(owner).donate({value: correctTestValue}),
      contract.connect(addr1).donate({value: correctTestValue}),
      contract.connect(addr1).donate({value: correctTestValue}),
      contract.connect(addr2).donate({value: correctTestValue}),
      contract.connect(addr2).donate({value: correctTestValue})
    ]);
  };
  
  beforeEach(async function () {
    const Donation = await ethers.getContractFactory("Donation");
    contract = await Donation.deploy();
    await contract.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Constructor", function () {
    it("Should set address of the owner that created the contract.", async function () {
      const minter = await contract.minter();
      expect(minter).to.equal(owner.address);
    });
  });

  /**
   * getAllDonators() and getDonationsByAddress() are also covered here. 
   */
  describe("Donate", function() {
    it("Should correctly perform incoming msg.value validation", async function () {
      await expect(contract.connect(addr2).donate({value: invalidTestValue}))
        .to.be.revertedWith('Amount must be greater than zero.');
    });

    it("Should add sent amount to balance if valiadtion passed", async function () {
      await donateSevenTimes();
      const newBalance = (await ethers.provider.getBalance(contract.address)).toNumber();
     
      expect(newBalance).to.equal(correctTestValue * 7);
    });

    it("Should record list of all donators", async function () {
      await donateSevenTimes();
      const listOfDonators = await contract.getAllDonators();
     
      expect(listOfDonators.length).to.equal(3);
      expect(listOfDonators.includes(owner.address)).to.be.true;
      expect(listOfDonators.includes(addr1.address)).to.be.true;
      expect(listOfDonators.includes(addr2.address)).to.be.true;
    });

    it("Should record each donator's cumulative amount", async function() {
      await donateSevenTimes();
      const ownerAmount = await contract.getDonationsByAddress(owner.address);
      const addr1Amount = await contract.getDonationsByAddress(addr1.address);
      const addr2Amount = await contract.getDonationsByAddress(addr2.address);

      expect(ownerAmount).to.be.equal(correctTestValue * 3);
      expect(addr1Amount).to.be.equal(correctTestValue * 2);
      expect(addr2Amount).to.be.equal(correctTestValue * 2);
    });
  });

  describe("TransferDonations", function() {
    it("Should throw an error if requested transfer amount is 0", async function () {
      await expect(contract.connect(addr1).tranferDonations(addr1.address, 0))
        .to.be.revertedWith('Amount must be greater than zero.');
    });

    it("Should only allow the owner to use this function", async function () {
      await expect(contract.connect(addr1).tranferDonations(addr1.address, 200))
        .to.be.revertedWith('Only owner can transfer Ether.');
    });

    it("Should throw an error if there is no Ether on balance of contract", async function () {
      await expect(contract.connect(owner).tranferDonations(addr1.address, 200))
        .to.be.revertedWith('There is no Ether to transfer.');
    });

    it("Should validate that requested transfer amount is less than balance", async function () {
      await donateSevenTimes();
      await expect(contract.connect(owner).tranferDonations(addr1.address, correctTestValue * 7))
        .to.be.revertedWith('Amount should be less than balance.');
    });

    it("Should transfer requested amount to address if all validation passes", async function () {
      await donateSevenTimes();
      const transferValue = correctTestValue * 5; 

      const previousBalance = (await addr1.getBalance()).toBigInt(); 
      await contract.connect(owner).tranferDonations(addr1.address, transferValue)
      const newBalance = (await addr1.getBalance()).toBigInt();

      const difference = Number(newBalance - previousBalance);

      expect(difference).to.be.equal(transferValue);
    });
  });
});