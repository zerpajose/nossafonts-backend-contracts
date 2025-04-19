import { ethers } from "ethers";
import dotenv from "dotenv";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/index.js";
import { tablelandClient } from "../clients/tableland.js";
import { pinataClient } from "../clients/pinata.js";

dotenv.config();
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const DEPLOY_WALLET_PRIVATE_KEY = process.env.DEPLOY_WALLET_PRIVATE_KEY;
const FONTS_TABLE_NAME = process.env.FONTS_FONTS_TABLE_NAME;

function storeFileToIPFS (fileBlob) {
  return pinataClient.upload.public.file(fileBlob);
}

function storeCSSToIPFS (name, nameCss, fileIpfs) {
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
      type: "text/css",
    }
  );
  return pinata.upload.public.fileArray([css]);
};

function storeMetadataToIPFS (name, nameCss, cssIpfs) {
  const metadataBlob = new Blob(
    [
      `{
      "description": "${name} font for OurFonts", 
      "external_url": "https://${cssIpfs}.ipfs.nftstorage.link/${nameCss}", 
      "image": "https://bafkreidbxtbnltylax5a76ieixe6gxnkgoayqbtvhfgqvt5gycbm6zx3jq.ipfs.nftstorage.link", 
      "name": "${name}"
      }`,
    ],
    { type: "text/json" }
  );

  return pinataClient.upload.public.file(metadataBlob);
};

const connectTableland = async () => {
  const aaku_splited = ALCHEMY_API_KEY_URL.split("/");

  const wallet = new ethers.Wallet(DEPLOY_WALLET_PRIVATE_KEY);

  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    aaku_splited[aaku_splited.length - 1]
  );

  const signer = wallet.connect(provider);
  const tableland = connect({
    signer,
    network: "testnet",
    chain: "base-sepolia",
  });

  return tableland;
};

const saveToTable = async (nftId, fontName) => {
  const db = tablelandClient();
  const query = `INSERT INTO ${FONTS_TABLE_NAME} (nft_id, name) VALUES (?, ?);`;
  console.log(`query: ${query}`);

  // Insert a row into the table
  const { meta: insert } = await db
  .prepare(query)
  .bind(nftId, fontName)
  .run();

  // Wait for transaction finality
  const writeRes = await insert.txn?.wait();

  // Error: db query execution failed (code: SQLITE_UNIQUE constraint failed: _80001_3548.nft_id, msg: UNIQUE constraint failed: _80001_3548.nft_id)

  return writeRes.hash;
};

const selectAll = async () => {
  let results = [];

  const tableland = await connectTableland();

  const { columns, rows } = await tableland.read(
    `SELECT * FROM ${FONTS_TABLE_NAME} LIMIT 10;`
  );

  return rows;
};

const selectSearch = async (search) => {
  const tableland = await connectTableland();

  const { columns, rows } = await tableland.read(
    `SELECT * FROM ${FONTS_TABLE_NAME} WHERE name LIKE '${search}%';`
  );

  return { columns, rows };
};

const getIsAllowed = async (addr) => {
  const customHttpProvider = new ethers.providers.JsonRpcProvider(
    ALCHEMY_API_KEY_URL
  );

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
