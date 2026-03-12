import { Readable } from "stream";
const pinataSDK = require("@pinata/sdk");

const pinata = new pinataSDK(
    process.env.PINATA_API_KEY || "dummy",
    process.env.PINATA_SECRET_KEY || "dummy"
);

export const uploadToIPFS = async (buffer: Buffer, originalHash: string): Promise<string> => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const options = {
        pinataMetadata: {
            name: `DocureChain-${originalHash.substring(0, 10)}`
        }
    };

    const result = await pinata.pinFileToIPFS(stream as any, options);
    return result.IpfsHash;
};
