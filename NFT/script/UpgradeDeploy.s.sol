// UpgradeDeploy.s.sol
// SPDX-License-Identifier: MIT
//used for deploy after the proxy running and upgrade the NFT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import "forge-std/Script.sol";
import {NFTMarketplace} from "../src/UpgradeNFT.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";


contract UpgradeScript is Script {
    function run() external {
        // string memory rpcUrl = vm.envString("SEPOLIA_RPC_URL");
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address proxyAdminAddress = vm.envAddress("PROXY_ADMIN_ADDRESS");
        address proxyAddress = vm.envAddress("PROXY_ADDRESS");

        console.log("read the proxy address", proxyAddress);
        console.log("read the admin proxy address", proxyAdminAddress);

        vm.startBroadcast(privateKey);

        //get the deployed proxyAdmin
        ProxyAdmin proxyAdmin = ProxyAdmin(proxyAdminAddress);
        
        // get the new NFTMarketplace address
        NFTMarketplace nftMarketplaceImplementation = new NFTMarketplace();

        // point to the new contract
        bytes memory data = new bytes(0);
        proxyAdmin.upgradeAndCall(
            ITransparentUpgradeableProxy(payable(proxyAddress)),
            address(nftMarketplaceImplementation),
            data
        );

        console.log("NFTMarketplace upgraded at proxy address:", proxyAddress);

        vm.stopBroadcast();
    }
}
