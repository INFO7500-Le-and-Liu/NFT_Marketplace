import React, { useState } from 'react';

const JWT = "PINATA_JWT";
const GATEWAY = "my-example.mypinata.cloud";

const PinFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  // 处理文件选择
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // 上传文件到 IPFS
  const pinFileToIPFS = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const request = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: data,
      });

      const response = await request.json();
      if (response.IpfsHash) {
        setCid(response.IpfsHash);
        console.log('File pinned with CID:', response.IpfsHash);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  // 从 IPFS 获取文件
  const fetchFileFromIPFS = async () => {
    if (!cid) return;
    setFetching(true);
    try {
      const url = `https://${GATEWAY}/ipfs/${cid}`;
      const request = await fetch(url);
      const response = await request.text();
      setFileContent(response);
      console.log('File content:', response);
    } catch (error) {
      console.error('Error fetching file:', error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <h1>IPFS File Upload and Fetch</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={pinFileToIPFS} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
      <button onClick={fetchFileFromIPFS} disabled={fetching || !cid}>
        {fetching ? 'Fetching...' : 'Fetch File'}
      </button>
      {fileContent && <pre>{fileContent}</pre>}
    </div>
  );
};

export default PinFile;
