import { ethers, network, run } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";

async function main() {
  let SimpleStorageFactory: SimpleStorage__factory;
  let simpleStorage: SimpleStorage;

  // We get the contract to deploy to hardhat network
  // which is in-built in hardhat like ganache providing rpc url and private keys
  SimpleStorageFactory = (await ethers.getContractFactory(
    "SimpleStorage",
  )) as unknown as SimpleStorage__factory;
  console.log("Deploying SimpleStorage...");
  simpleStorage = await SimpleStorageFactory.deploy();
  const txReceipt = await simpleStorage.deploymentTransaction()?.wait();

  const contractAddress = txReceipt?.contractAddress;

  console.log("SimpleStorage deployed to:", contractAddress);

  // Verify the contract if only on sepolia network and etherscan api key is provided
  // not on hardhat network because it is not on etherscan
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    // 5 blocks is sort of a guess
    console.log("Verifying contract in 5 blocks...");
    await simpleStorage.deploymentTransaction()?.wait(5);
    await verify(contractAddress!, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log("Current value:", currentValue.toString());

  console.log("Updating storage value...");
  let transactionResponse = await simpleStorage.store(10);
  await transactionResponse.wait();

  let updatedValue = await simpleStorage.retrieve();
  console.log("Updated value:", updatedValue.toString());

  transactionResponse = await simpleStorage.addPerson("Noumaan", 69);
  await transactionResponse.wait();

  let person = await simpleStorage.people(0);
  console.log("Person:", person.name);

  let favNumOfPerson = await simpleStorage.nameToFavoriteNumber("Noumaan");
  console.log("Favorite number of Noumaan:", favNumOfPerson.toString());

  console.log("Updating favorite number of Noumaan...");
  transactionResponse = await simpleStorage.store(favNumOfPerson);
  await transactionResponse.wait();

  updatedValue = await simpleStorage.retrieve();
  console.log("Updated value:", updatedValue.toString());
}

// Verify the contract on etherscan either using etherscan api (progmmatically) or manually
// using hardhat-verify plugin, npx hardhat verify --network sepolia <deployed-contract-address>
const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");
  try {
    // run -> run a hardhat task
    console.log("Running hardhat verify task...");

    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    console.log(e);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
