// src/types.d.ts
export interface NFT {
    tokenId: number;
    name: string;
    image: string;
    description: string;
    [key: string]: any; // 允许其他元数据字段
  }
  