import { ethers } from "hardhat";

async function main() {
  const simpleStorage = await ethers.deployContract("SimpleStorage");

  await simpleStorage.waitForDeployment();

  console.log("SimpleStorage deployed to:", simpleStorage.target);

  const currentValue = await simpleStorage.retrieve();
  console.log("Current value:", currentValue.toString());

  console.log("Updating storage value...");
  let transactionResponse = await simpleStorage.store(10);
  await transactionResponse.wait();

  let updatedValue = await simpleStorage.retrieve();
  console.log("Updated value:", updatedValue.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
