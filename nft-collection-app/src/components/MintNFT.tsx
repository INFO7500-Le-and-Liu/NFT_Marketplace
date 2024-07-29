import React, { useState } from 'react';
import { ethers } from 'ethers';
import { signer } from '../Web3'; 

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

  const uploadToIPFS = (file: File): Promise<string> => {
    if (!file) return Promise.reject(new Error('No file selected'));
    
    const data = new FormData();
    data.append("file", file);

    return fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
      body: data,
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error('Error response from Pinata:', text);
            return Promise.reject(new Error('Failed to upload file to IPFS'));
          });
        }
        return response.json();
      })
      .then(result => {
        if (result.IpfsHash) {
          return `https://${GATEWAY}/ipfs/${result.IpfsHash}`;
        } else {
          return Promise.reject(new Error('Failed to upload file to IPFS'));
        }
      });
  };

  const mintNFT = () => {
    if (!file || !name || !description || !price) return;
    setMinting(true);

    uploadToIPFS(file)
      .then(imageUrl => {
        console.log('Image URI:', imageUrl);

        const metadata = {
          name,
          description,
          image: imageUrl,
        };

        const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const metadataData = new FormData();
        metadataData.append("file", metadataBlob, "metadata.json");

        return fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: metadataData,
        });
      })
      .then(metadataResponse => {
        if (!metadataResponse.ok) {
          return metadataResponse.text().then(text => {
            console.error('Error response from Pinata:', text);
            return Promise.reject(new Error('Failed to upload metadata to IPFS'));
          });
        }
        return metadataResponse.json();
      })
      .then(metadataResult => {
        if (metadataResult.IpfsHash) {
          const metadataUrl = `https://${GATEWAY}/ipfs/${metadataResult.IpfsHash}`;
          console.log('Metadata URL:', metadataUrl);

          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          const priceInWei = ethers.utils.parseEther(price);

          return contract.mintNFT(metadataUrl, priceInWei);
        } else {
          return Promise.reject(new Error('Failed to upload metadata to IPFS'));
        }
      })
      .then(transaction => transaction.wait())
      .then(() => {
        alert('NFT Minted!');
        setFile(null);
        setName('');
        setDescription('');
        setPrice('');
      })
      .catch(error => {
        console.error('Error minting NFT:', error);
      })
      .finally(() => {
        setMinting(false);
      });
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
