import { ethers } from "ethers";
import { NFTStorage, File } from "nft.storage";
import dotenv from "dotenv";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants/index.js";
import { connect } from "@tableland/sdk";

dotenv.config();
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const TABLE_NAME = "_80001_3548";

// create a new NFTStorage client using our API key
const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

const storeFileToIPFS = async (file_blob) => {
  return await nftstorage.storeBlob(file_blob);
};

const storeCSSToIPFS = async (name, originalname, file_ipfs) => {
  let name_css = `${originalname.split(".")[0]}.css`;
  // for css
  const css = new File(
    [
      `@font-face {
      font-family: '${name}';
      font-display: swap;
      src: url(https://${file_ipfs}.ipfs.nftstorage.link);
      }`,
    ],
    name_css,
    {
      type: "text/css",
    }
  );

  return await nftstorage.storeDirectory([css]);
};

const storeMetadataToIPFS = async (name, css_ipfs) => {
  // for metadata
  const metadata = new Blob(
    [
      `{
      "description": "${name} font for OurFonts", 
      "external_url": "https://${css_ipfs}.ipfs.nftstorage.link/${name}.css", 
      "image": "https://bafkreidbxtbnltylax5a76ieixe6gxnkgoayqbtvhfgqvt5gycbm6zx3jq.ipfs.nftstorage.link", 
      "name": "${name}"
      }`,
    ],
    { type: "text/json" }
  );

  return await nftstorage.storeBlob(metadata);
};

const connectTableland = async () => {
  const aaku_splited = ALCHEMY_API_KEY_URL.split("/");

  const wallet = new ethers.Wallet(PRIVATE_KEY);

  const provider = new ethers.providers.AlchemyProvider(
    "maticmum",
    aaku_splited[aaku_splited.length - 1]
  );

  const signer = wallet.connect(provider);
  const tableland = await connect({
    signer,
    network: "testnet",
    chain: "polygon-mumbai",
  });

  return tableland;
};

const saveToTable = async (nftId, fontName) => {
  const tableland = await connectTableland();

  const query = `INSERT INTO ${TABLE_NAME} (nft_id, name) VALUES (${nftId}, '${fontName}');`;
  console.log(`query: ${query}`);

  // Error: db query execution failed (code: SQLITE_UNIQUE constraint failed: _80001_3548.nft_id, msg: UNIQUE constraint failed: _80001_3548.nft_id)

  const writeRes = await tableland.write(query);

  return writeRes.hash;
};

const selectAll = async () => {
  let results = [];

  const tableland = await connectTableland();

  const { columns, rows } = await tableland.read(
    `SELECT * FROM ${TABLE_NAME} LIMIT 10;`
  );

  return rows;
};

const selectSearch = async (search) => {
  const tableland = await connectTableland();

  const { columns, rows } = await tableland.read(
    `SELECT * FROM ${TABLE_NAME} WHERE name LIKE '${search}%';`
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
