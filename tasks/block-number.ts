import "@nomicfoundation/hardhat-ethers";
import { task } from "hardhat/config";

export default task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Current block number: " + blockNumber);
  },
);
