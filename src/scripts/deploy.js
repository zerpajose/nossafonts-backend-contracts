const { ethers } = require("hardhat");

async function main() {

  const contract = await ethers.getContractFactory("OurFonts");

  const deployedContract = await contract.deploy();

  await deployedContract.deployed();

  console.log("Deployed Contract Address:", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });