// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { MasterMerchant } from "./MasterMerchant.sol";

contract Wallet {
    address masterMerchantAddress;

    constructor(address masterMerchant) {
        masterMerchantAddress = masterMerchant;
    }

    // Creates a new wallet
    function createWallet() public {
        MasterMerchant masterMerchant = MasterMerchant(payable(masterMerchantAddress));
        masterMerchant.createWallet();
    }

    // Receives and transfers assets to the master merchant
    receive() external payable {
        payable(masterMerchantAddress).transfer(msg.value);
        createWallet();
    }
}
