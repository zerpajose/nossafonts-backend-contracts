import dotenv from 'dotenv';
import { Database } from '@tableland/sdk';
import { Wallet, getDefaultProvider } from 'ethers';

dotenv.config();
const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL ?? '';
const DEPLOY_WALLET_PRIVATE_KEY = process.env.DEPLOY_WALLET_PRIVATE_KEY ?? '';
const wallet = new Wallet(DEPLOY_WALLET_PRIVATE_KEY);
const provider = getDefaultProvider(ALCHEMY_API_KEY_URL);
const signer = wallet.connect(provider);

interface FontTableSchema {
  font_id: number;
  name: string;
}

export const db: Database<FontTableSchema> = new Database({ signer });
