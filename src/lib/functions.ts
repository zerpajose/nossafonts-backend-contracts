import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/index.js';
import { db } from '../clients/tableland.js';
import { pinata } from '../clients/pinata.js';

dotenv.config();
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL ?? '';
const FONTS_TABLE_NAME = process.env.FONTS_TABLE_NAME ?? '';

async function storeFileToIPFS(fileBlob: File) {
  const { cid } = await pinata.upload.public.file(fileBlob);
  return cid;
}

async function storeCSSToIPFS(name: string, nameCss: string, fileIpfs: string) {
  const css = new File(
    [
      `@font-face {
      font-family: '${name}';
      font-display: swap;
      src: url(https://${fileIpfs}.ipfs.nftstorage.link);
      }`,
    ],
    nameCss,
    {
      type: 'text/css',
    }
  );
  const { cid } = await pinata.upload.public.fileArray([css]);
  return cid;
}

async function storeMetadataToIPFS(
  name: string,
  nameCss: string,
  cssIpfs: string
) {
  const metadataBlob = new File(
    [
      `{
      "description": "${name} font for OurFonts", 
      "external_url": "https://${cssIpfs}.ipfs.nftstorage.link/${nameCss}", 
      "image": "https://bafkreidbxtbnltylax5a76ieixe6gxnkgoayqbtvhfgqvt5gycbm6zx3jq.ipfs.nftstorage.link", 
      "name": "${name}"
      }`,
    ],
    nameCss,
    { type: 'text/json' }
  );

  const { cid } = await pinata.upload.public.file(metadataBlob);
  return cid;
}

const saveToTable = async (nftId: string, fontName: string) => {
  const query = `INSERT INTO ${FONTS_TABLE_NAME} (nft_id, name) VALUES (?, ?);`;
  console.log(`query: ${query}`);

  // Insert a row into the table
  const { meta: insert } = await db.prepare(query).bind(nftId, fontName).run();

  // Wait for transaction finality
  const writeRes = await insert.txn?.wait();

  // Error: db query execution failed (code: SQLITE_UNIQUE constraint failed: _80001_3548.nft_id, msg: UNIQUE constraint failed: _80001_3548.nft_id)

  return writeRes?.transactionHash;
};

const selectAll = async () => {
  const { results } = await db
    .prepare(`SELECT * FROM ${FONTS_TABLE_NAME};`)
    .all();
  return results;
};

const selectSearch = async (search: string) => {
  const { results } = await db
    .prepare(`SELECT * FROM ${FONTS_TABLE_NAME} WHERE name LIKE ?;`)
    .bind(`${search}%`)
    .all();

  return results;
};

const getIsAllowed = async (addr: string) => {
  const customHttpProvider = new ethers.JsonRpcProvider(ALCHEMY_API_KEY_URL);

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    customHttpProvider
  );

  const is_allowed = await contract.allowList(addr);

  return is_allowed;
};

export {
  storeFileToIPFS,
  storeCSSToIPFS,
  storeMetadataToIPFS,
  saveToTable,
  selectAll,
  selectSearch,
  getIsAllowed,
};
