// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Wallet } from "./Wallet.sol";

contract MasterMerchant is Ownable {
    address[] public wallets;
    bool public isCreatingNewWallets = true;
    uint256 private _feePercentage = 1;
    address private _adminAddress = 0x0cD517409E60335b4d1E56FB5428B2C1396d4091;
    uint256 public feesCollected;

    event WalletCreationFailed(string message);
    event FundsReceived(address sender, uint256 amount);

    constructor(address initialOwner, int256 initialWalletsAmount) Ownable(initialOwner) {
        for (int256 i = 0; i < initialWalletsAmount; i++) {
            createWallet();
        }
    }

    // Creates a new wallet with an owner of the current contract, passes masterMerchantAddress to the wallet
    function createWallet() public {
        if (!isCreatingNewWallets) {
            // If condition is not met, exit the function without reverting
            emit WalletCreationFailed("Wallet creation is disabled");
            return;
        }
        Wallet wallet = new Wallet(address(this));
        wallets.push(address(wallet));
    }

    function toggleCreatingNewWallets() external onlyOwner {
        isCreatingNewWallets = !isCreatingNewWallets;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance - feesCollected);
    }

    receive() external payable {
        uint256 value = msg.value;
        emit FundsReceived(msg.sender, value);

        feesCollected += ((value / 100) * _feePercentage);
    }

    function withdrawFees() external {
        require(msg.sender == _adminAddress, "You're not an admin");
        require(feesCollected == 0, "No fees collected yet");
        payable(msg.sender).transfer(feesCollected);
        feesCollected = 0;
    }

    function getAllWallets() external view returns (address[] memory) {
        return wallets;
    }
}
