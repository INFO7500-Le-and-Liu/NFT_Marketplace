import React, { useState } from 'react';
import { ethers } from 'ethers';
import ipfs from '../services/ipfsClient';
import { signer } from '../Web3';



function MintNFT({ contractAddress, contractABI ,loadNFTs}) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');  
  const [minting, setMinting] = useState(false);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async (file) => {
    const result = await ipfs.add(file);
    return `https://ipfs.io/ipfs/${result.path}`;
  };

  const mintNFT = async () => {
    if (!file || !name || !description || !price) return; 
    setMinting(true);

    try {
      const imageUrl = await uploadToIPFS(file); // debug use
      console.log('Image URI:', imageUrl);
      const metadata = {
        name,
        description,
        image: imageUrl,
      };
      const metadataResult = await ipfs.add(JSON.stringify(metadata));
      const metadataUrl = `https://ipfs.io/ipfs/${metadataResult.path}`;
      console.log('Metadata URL:', metadataUrl); // print the URL of the NFT

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const priceInWei = ethers.utils.parseEther(price); // turn to Wei

      const transaction = await contract.mintNFT(metadataUrl, priceInWei);
      await transaction.wait();
      alert('NFT Minted!');

      loadNFTs();
      // clear the input
      setFile(null);
      setName('');
      setDescription('');
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
      <input type="text" placeholder="NFT Price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} /> {/* 新增价格输入 */}
      <button onClick={mintNFT} disabled={minting}>
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
    </div>
  );
}

export default MintNFT;
