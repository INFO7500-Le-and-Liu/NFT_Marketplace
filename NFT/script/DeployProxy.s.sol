// SPDX-License-Identifier: MIT
// Deploy Proxy
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import "forge-std/Script.sol";
import {NFTMarketplace} from "../src/UpgradeNFT.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract DeployProxyScript is Script {
    function run() external {
        // uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address proxyAdminAddress = vm.envAddress("PROXY_ADMIN_ADDRESS");
        address nftMarketplaceImplementationAddress = vm.envAddress("NFT_MARKETPLACE_IMPLEMENTATION_ADDRESS");

        // console.log("env read",privateKey);
        console.log("env read",proxyAdminAddress);
        console.log("env read",nftMarketplaceImplementationAddress);

        // Start broadcasting transactions
        vm.startBroadcast();

        // Get the ProxyAdmin and NFTMarketplace implementation contracts
        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        NFTMarketplace nftMarketplaceImplementation = NFTMarketplace(nftMarketplaceImplementationAddress);

        // Create a new TransparentUpgradeableProxy pointing to the NFTMarketplace implementation
        TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
            address(nftMarketplaceImplementation),
            address(proxyAdmin),
            abi.encodeWithSignature("initialize()")
        );

        // Log the deployed contract address
        console.log("proxy deployed to:", address(proxy));

        // Stop broadcasting transactions
        vm.stopBroadcast();
    }
}
