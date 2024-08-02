// PurchaseNFT.tsx
import { ethers } from 'ethers';

import nftCollection from '../abi/NFTMarketplace.json'; // ABI file
import { web3Service } from './Web3';

const contractAddress: string = '0x4a0bB8932CAB92BC97d0DB30612cd66DB2Cd4E5D'; // 合约地址
const contractABI: ethers.ContractInterface = nftCollection.abi; // ABI

// 导出函数
export async function purchaseNFT(tokenId: string, price: string) {
  try {

    if (!web3Service.signer) {
      throw new Error("No signer available. Please connect to a wallet.");
    }
    const signer = web3Service.signer;

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const transaction = await contract.purchaseNFT(tokenId, {
      value: ethers.utils.parseEther(price)
    });
    await transaction.wait();

    console.log("Transaction:", transaction);
    console.log("Transaction Hash:", transaction.hash);

    // const event = receipt.events?.find((event: { event: string; }) => event.event === "NFTPurchased");
    // const purchasedTokenId = event?.args?.tokenId;

    // console.log(`Purchased NFT with token ID: ${purchasedTokenId}`);
    
    // return purchasedTokenId; 
  } catch (error) {
    console.error("Error in purchaseNFT function:", error);
    throw error; 
  }
}
