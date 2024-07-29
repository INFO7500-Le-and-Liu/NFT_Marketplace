import React, { useState } from 'react';
import { ethers } from 'ethers';
import { signer } from '../Web3'; 

// 替换为你的 Pinata 配置信息
const JWT = "PINATA_JWT"; // 确保使用正确的 JWT
const GATEWAY = "yellow-wrong-piranha-786.mypinata.cloud"; // 确保使用正确的网关 URL

interface MintNFTProps {
  contractAddress: string;
  contractABI: any;
}

const MintNFT: React.FC<MintNFTProps> = ({ contractAddress, contractABI }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [minting, setMinting] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    if (!file) throw new Error('No file selected');
    
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {  //401
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: data,
      });

      // 调试响应
      if (!response.ok) {
        console.error('Error response from Pinata:', await response.text());
        throw new Error('Failed to upload file to IPFS');
      }

      const result = await response.json();
      if (result.IpfsHash) {
        return `https://${GATEWAY}/ipfs/${result.IpfsHash}`;
      } else {
        throw new Error('Failed to upload file to IPFS');
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  };

  const mintNFT = async () => {
    if (!file || !name || !description || !price) return;
    setMinting(true);

    try {
      const imageUrl = await uploadToIPFS(file);  //401
      console.log('Image URI:', imageUrl);

      const metadata = {
        name,
        description,
        image: imageUrl,
      };

      // 上传 metadata 到 IPFS
      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataData = new FormData();
      metadataData.append("file", metadataBlob, "metadata.json");

      const metadataResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: metadataData,
      });

      // 调试响应
      if (!metadataResponse.ok) {
        console.error('Error response from Pinata:', await metadataResponse.text());
        throw new Error('Failed to upload metadata to IPFS');
      }

      const metadataResult = await metadataResponse.json();
      if (metadataResult.IpfsHash) {
        const metadataUrl = `https://${GATEWAY}/ipfs/${metadataResult.IpfsHash}`;
        console.log('Metadata URL:', metadataUrl);

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const priceInWei = ethers.utils.parseEther(price);

        const transaction = await contract.mintNFT(metadataUrl, priceInWei);
        await transaction.wait();
        alert('NFT Minted!');

        // 清除输入
        setFile(null);
        setName('');
        setDescription('');
        setPrice('');
      } else {
        throw new Error('Failed to upload metadata to IPFS');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <input type="text" placeholder="NFT Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="NFT Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="NFT Price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button onClick={mintNFT} disabled={minting}>
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  );
};

export default MintNFT;
