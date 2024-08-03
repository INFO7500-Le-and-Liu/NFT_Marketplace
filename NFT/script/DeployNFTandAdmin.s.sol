// SPDX-License-Identifier: MIT
// first time deploy the admin proxy and the NFT NFT market
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import "forge-std/Script.sol";
import {NFTMarketplace} from "../src/UpgradeNFT.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {MyTransparentUpgradeableProxy} from "../src/TransparentUpgradeableProxy.sol";

contract DeployMarketplaceScript is Script {
    function run() external {
        // Start broadcasting transactions with a specified private key
        vm.startBroadcast();

        // Create a new ProxyAdmin contract with the deployer's address as the owner
        ProxyAdmin proxyAdmin = new ProxyAdmin(msg.sender);

        // Deploy the new NFTMarketplace implementation contract
        NFTMarketplace nftMarketplaceImplementation = new NFTMarketplace();

       
        // Log the deployed contract addresses
        console.log("NFTMarketplace deployed to:", address(nftMarketplaceImplementation));
        console.log("ProxyAdmin deployed to:", address(proxyAdmin));

        // Stop broadcasting transactions
        vm.stopBroadcast();


         // Create a new TransparentUpgradeableProxy pointing to the NFTMarketplace implementation
        // MyTransparentUpgradeableProxy proxy = new MyTransparentUpgradeableProxy(
        //     address(nftMarketplaceImplementation),
        //     address(proxyAdmin),
        //     abi.encodeWithSignature("initialize()")
        // );

    }
}
