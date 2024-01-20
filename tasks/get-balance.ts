import "@nomicfoundation/hardhat-ethers";
import { task } from "hardhat/config";

export default task("balance", "Prints an account's balance")
  .addParam("account", 'The account"s address')
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(taskArgs.account);

    console.log(ethers.formatEther(balance), "ETH");
  });
