import React, { useState } from 'react';
import { mintNFT } from '../services/MintNFT';
import './UploadComponent.css';
 
const JWT = process.env.REACT_APP_PINATA_JWT || "";
const JWTO = process.env.REACT_APP_PINATA_JWT_OUTSIDE || "";
 
const UploadComponent: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  // set price config
  const [price, setPrice] = useState<string>("");  
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cid, setCid] = useState<string>("");  
 
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };
 
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);  
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);  
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);  
  };
 
  // const handleCidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setCid(event.target.value);  
  // };

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
      setCid(resData.IpfsHash);;
      let tokenID = 0;
      // mint NFT
      try {
          tokenID = await mintNFT(resData.IpfsHash, price);
          console.log("NFT has been minted successfully!");
          // window.location.reload();
      } catch (mintError) {
          console.error("Error minting NFT:", mintError);
      }
      const nftInfoo = {
        name,
        price,
        description,
        cid,
        tokenID
      };

      //debug
      console.log('nftInfoo Object:', nftInfoo);
      console.log('nftInfoo JSON:', JSON.stringify(nftInfoo));

      const url1 = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
      const responseo = await fetch(url1, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWTO}`,
        },
        body: JSON.stringify(nftInfoo),
      });
      

      if (!responseo.ok) {
        console.error('Error responseo from Pinata:', await responseo.text());
        throw new Error('Failed to upload json to IPFS');
      }
      
      const result = await responseo.json();
      console.log("result: ",result);

    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
 
      

  return (
    <div>
      <label className="form-label">Choose Files</label>
      <input type="file" multiple onChange={changeHandler} />
      <input type="text" value={price} onChange={handlePriceChange} placeholder="Enter price" />
      <input type="text" value={name} onChange={handleNameChange} placeholder="Enter name" />
      {/* <input type="text" value={image} onChange={handleImageChange} placeholder="Enter image" /> */}
      <input type="text" value={description} onChange={handleDescriptionChange} placeholder="Enter description" />
      <button onClick={pinDirectoryToPinata}>Upload to IPFS and Mint NFT</button>
    </div>
  );
};
 
export default UploadComponent;