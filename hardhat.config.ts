
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;
const DEPLOY_WALLET_PRIVATE_KEY = process.env.DEPLOY_WALLET_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    basesepolia: {
      url: ALCHEMY_API_KEY_URL || "https://sepolia.base.org",
      chainId: 84532,
      live: true,
      accounts: DEPLOY_WALLET_PRIVATE_KEY ? [`0x${DEPLOY_WALLET_PRIVATE_KEY}`] : [],
    },
  },
};
