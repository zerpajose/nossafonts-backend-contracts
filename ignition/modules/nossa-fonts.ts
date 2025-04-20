import dotenv from "dotenv";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

dotenv.config({ path: ".env" });

const INITIAL_OWNER_ADDRESS = process.env.INITIAL_OWNER_ADDRESS;

export default buildModule("NossaFonts", (m) => {
  const initialOwner = m.getParameter("initialOwner", INITIAL_OWNER_ADDRESS);
  const contract = m.contract("NossaFonts", [initialOwner]);

  return { contract };
});
