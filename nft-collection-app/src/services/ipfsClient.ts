import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';

const projectId = '666b2389d9d44c28a93a2f20cbd85f79';
const projectSecret = 'HcUPwGRAFS34R2u7zJmWvzXE3WVrmBzen5gISkgThjJoeNzxUjdebA';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  }
});

console.log("Authorization Header:", auth);

export default ipfs;
