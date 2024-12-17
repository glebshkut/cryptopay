// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Wallet } from "./Wallet.sol";

contract MasterMerchant is Ownable {
    address[] public wallets;
    bool public isCreatingNewWallets = true;

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
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
}
