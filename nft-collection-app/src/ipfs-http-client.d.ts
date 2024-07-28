declare module 'ipfs-http-client' {
  export function create(options: {
    host: string;
    port: number;
    protocol: string;
    headers: {
      authorization: string;
    };
  }): IPFS;

  export interface IPFS {
    add: (content: any) => Promise<{ path: string }>;
  }
}
