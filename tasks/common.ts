const getDonationContract = (async (address: string) => {
  const DonateContract = await ethers.getContractFactory('Donation');

  return await DonateContract.attach(address);
});

export default getDonationContract;