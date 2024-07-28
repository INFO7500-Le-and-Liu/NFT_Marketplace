import React from 'react';

// 定义 NFT 对象的类型
import { NFT } from '../type'; // 导入 NFT 类型

// 定义组件的 props 类型
interface DisplayNFTsProps {
  nfts: NFT[];
}

const DisplayNFTs: React.FC<DisplayNFTsProps> = ({ nfts }) => {
  return (
    <div>
      {nfts.length === 0 ? <p>No NFTs found.</p> : null}
      {nfts.map((nft) => (
        <div key={nft.tokenId}>
          <h3>{nft.name}</h3>
          <img src={nft.image} alt={nft.name} width="200" />
          <p>{nft.description}</p>
        </div>
      ))}
    </div>
  );
};

export default DisplayNFTs;
