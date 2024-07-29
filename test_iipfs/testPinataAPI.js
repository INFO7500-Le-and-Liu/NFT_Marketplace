const PINATA_API_URL = 'https://api.pinata.cloud/data/pinList?includeCount=true';
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

(async () => {
  const fetch = (await import('node-fetch')).default;

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxMTUxNzIxOS1iZGE1LTRhNjEtOWE3Yi05YTgyZWQ0ZDBiNmYiLCJlbWFpbCI6ImxpdS5kb25neXVAbm9ydGhlYXN0ZXJuLmVkdSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMGRhYmE4NjZiNTc4MWM4MjFmOCIsInNjb3BlZEtleVNlY3JldCI6IjFhNThmZDdhMDJjM2JlZjYwZTI2YmNiY2Y5OGRjNjczMTYwMTk3NzdiY2YwYmU5ZjliZWM1ZTJhMDQyMGMzMjkiLCJleHAiOjE3NTM3NzYzNjd9.0mlgz9N61CjUxf2EtYiuZUNDDfz4H-DDtYz7o8DL1UA'
    }
  };

  try {
    const response = await fetch(PINATA_API_URL, options);
    const data = await response.json();
    console.log('API Response:', data); // 打印整个响应对象以了解其结构

    const files = data.rows;
    if (!files) {
      console.error('No files found in response');
      return;
    }

    const cids = files.map(file => file.ipfs_pin_hash);

    for (const cid of cids) {
      try {
        const metadataResponse = await fetch(`${IPFS_GATEWAY}${cid}`);
        const metadata = await metadataResponse.json();
        console.log('Metadata for CID:', cid, metadata);
      } catch (err) {
        console.error('Error fetching metadata for CID:', cid, err);
      }
    }
  } catch (err) {
    console.error('Error fetching Pinata data:', err);
  }
})();
