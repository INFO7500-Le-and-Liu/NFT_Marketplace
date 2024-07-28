"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const ipfs_http_client_1 = require("ipfs-http-client");
const projectId = '666b2389d9d44c28a93a2f20cbd85f79';
const projectSecret = 'HcUPwGRAFS34R2u7zJmWvzXE3WVrmBzen5gISkgThjJoeNzxUjdebA';
const auth = `Basic ${buffer_1.Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
const ipfs = (0, ipfs_http_client_1.create)({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    }
});
console.log("Authorization Header:", auth);
exports.default = ipfs;
