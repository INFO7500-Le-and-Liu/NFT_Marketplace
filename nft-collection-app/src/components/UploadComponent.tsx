import React, { useState } from 'react';

// 替换为你的 Pinata 配置信息
const JWT = process.env.REACT_APP_PINATA_JWT || ""; // 确保使用正确的 JWT

const UploadComponent: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
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
      console.log(resData);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      <label className="form-label">Choose Files</label>
      <input type="file" multiple onChange={changeHandler} />
      <button onClick={pinDirectoryToPinata}>Upload to IPFS</button>
    </div>
  );
};

export default UploadComponent;
