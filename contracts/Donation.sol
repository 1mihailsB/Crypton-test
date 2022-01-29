// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Donation {

    address public minter;
    address[] private donatorList;
    mapping(address => uint256) private donations;

    modifier amountGtZero(uint256 amount) {
        require(amount > 0, "Amount must be greater than zero.");
        _;
    }

    constructor() {
        minter = msg.sender;
    }

    function donate() external payable amountGtZero(msg.value){
        if (donations[msg.sender] == 0) {
            donatorList.push(msg.sender);
        }

        donations[msg.sender] += msg.value;
    }

    function tranferDonations(address payable to, uint256 amount) public amountGtZero(amount) {
        require(msg.sender == minter, "Only owner can transfer Ether.");
        require(address(this).balance > 0, "There is no Ether to transfer.");
        require(amount < address(this).balance, "Amount should be less than balance.");

        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Failed to transfer Ether");
    }

    function getAllDonators() public view returns(address[] memory) {
        return donatorList;
    }

    function getDonationsByAddress(address addr) public view returns(uint256) {
        require (addr != address(0), "Address should not be zero.");
        return donations[addr];
    }
}