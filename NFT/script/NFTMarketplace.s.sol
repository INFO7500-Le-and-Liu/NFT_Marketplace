// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/NFTMarketplace.sol"; // set the path
//import "../src/UpgradeNFT.sol" //use for upgrade the NFTmarket place

contract DeployNFTMarketplace is Script {
    function run() public {
        vm.startBroadcast(); // boardcast

        // deploy
        NFTMarketplace nftMarketplace = new NFTMarketplace();

        console.log("NFTMarketplace deployed at:", address(nftMarketplace));

        vm.stopBroadcast(); // stop boardcast
    }
}
