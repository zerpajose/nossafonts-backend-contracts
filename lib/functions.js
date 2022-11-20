import { ethers } from 'ethers'
import { NFTStorage, File } from 'nft.storage'
import dotenv from 'dotenv'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/index.js'
import { connect } from "@tableland/sdk"

dotenv.config()
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

const TABLE_NAME = "_80001_3548"

const storeFileToIPFS = async (file_blob, mimetype) => {

  let format
  switch (mimetype.split("/")[1]) {
    case 'ttf':
    case 'tte':
    case 'sfnt':
    case 'dfont':
      format = 'truetype'
      break
    case 'otf':
    case 'otc':
    case 'ttc':
      format = 'opentype'
      break
    case 'woff':
      format = 'woff'
      break
    case 'woff2':
      format = 'woff2'
      break
    case 'eot':
      format = 'embedded-opentype'
      break
    case 'svg':
      format = 'svg'
      break
    default:
      format= 'truetype'
      break
  }

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

  // for font file
  const file_ipfs = await nftstorage.storeBlob(file_blob)

  return file_ipfs
}

const storeCSSToIPFS = async (name, style, weight, file_ipfs) => {

  // for css
  const css = new Blob([`
    @font-face {
      font-family: '${name}';
      font-style: ${style};
      font-weight: ${weight};
      font-display: swap;
      src: url(https://ipfs.io/ipfs/${file_ipfs}) format('${format}');
    }
  `], {type: 'text/css'})

  const css_ipfs = await nftstorage.storeBlob(css)

  // for metadata
  const metadata = new Blob([`
  {
      "description": "ubuntu font for dfonts", 
      "external_url": "ipfs.io/ipfs/${css_ipfs}", 
      "image": "ipfs://dfontslogo", 
      "name": "ubuntu"
  }
  `], {type: 'text/json'})

  const metadata_ipfs = await nftstorage.storeBlob(metadata)

  return metadata_ipfs
}

const connectTableland = async () => {
  const aaku_splited = ALCHEMY_API_KEY_URL.split('/')
  
  const wallet = new ethers.Wallet(PRIVATE_KEY)

  const provider = new ethers.providers.AlchemyProvider("maticmum", aaku_splited[aaku_splited.length-1])

  const signer = wallet.connect(provider)
  const tableland = await connect({
    signer,
    network: "testnet",
    chain: "polygon-mumbai"
  })

  return tableland
}

const saveToTable = async (nftId, fontName) => {

  const tableland = await connectTableland()

  const query = `INSERT INTO ${TABLE_NAME} (nft_id, name) VALUES (${nftId}, '${fontName}');`

  const writeRes = await tableland.write(query)

  return writeRes.hash

}

const selectAll = async () => {

  let results = []

  const tableland = await connectTableland()

  const obj = await tableland.read(`SELECT * FROM ${TABLE_NAME} LIMIT 10;`)
  
  Object.values(obj).forEach(element => {
    results.push(`{${element.nft_id}: '${element.name}'}`)
  })
  
  return results
}

const selectSearch = async (search) => {
  
  const tableland = await connectTableland()

  const {columns, rows } = await tableland.read(`SELECT * FROM ${TABLE_NAME} WHERE name LIKE '${search}%';`)
  
  return { columns, rows }
}

const getIsAllowed = async (addr) => {
  
  const customHttpProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_KEY_URL)

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, customHttpProvider)

  const is_allowed = await contract.allowList(addr)

  return is_allowed
}

export {
  storeFileToIPFS,
  storeCSSToIPFS,
  saveToTable,
  selectAll,
  selectSearch,
  getIsAllowed
}