import React, { useState } from 'react';
import {mintNFT} from '../services/MintNFT';

const JWT = process.env.REACT_APP_PINATA_JWT || "";

const UploadComponent: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // set price config
  const [price, setPrice] = useState<string>("");  

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);  
  };

  const pinDirectoryToPinata = async () => {
    if (!selectedFiles) {
      console.error("No files selected");
      return;
    }

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    try {
      const data = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        data.append(`file`, file, file.name);
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${JWT}`,
        },
        body: data
      });

      if (!response.ok) {
        console.error('Error response from Pinata:', await response.text());
        throw new Error('Failed to upload file to IPFS');
      }

      const resData = await response.json();
      console.log('CID:', resData.IpfsHash);  // get and print CID

      // mint NFT
      try {
          const tokenID = await mintNFT(resData.IpfsHash, price);
          console.log("NFT has been minted successfully!");
         // window.location.reload();
      } catch (mintError) {
          console.error("Error minting NFT:", mintError);
      }

      //TODO: 套娃
      //data append name/despc/ID

    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      <label className="form-label">Choose Files</label>
      <input type="file" multiple onChange={changeHandler} />
      <input type="text" value={price} onChange={handlePriceChange} placeholder="Enter price" />
      <button onClick={pinDirectoryToPinata}>Upload to IPFS and Mint NFT</button>
    </div>
  );
};

export default UploadComponent;
