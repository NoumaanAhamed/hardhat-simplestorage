// as in frontend, we use import syntax, we need to add type="module" in the script tag
import { ethers } from "./ethers-6.7.0.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const ethereumButton = document.querySelector(".enableEthereumButton");
const showAccount = document.querySelector(".showAccount");

ethereumButton.addEventListener("click", () => {
  connect();
});

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await getAccount();
    await setContract();
  } else {
    ethereumButton.textContent = "Please install MetaMask!";
  }
}

async function getAccount() {
  const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        ethereumButton.textContent = "Connect to MetaMask";
        console.log(err.message);
      } else {
        console.error(err);
      }
    });
  ethereumButton.textContent = "Connected";
  const account = accounts[0];
  showAccount.innerHTML = account;
}

async function setContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  // const contractProvider = new ethers.Contract(contractAddress, abi, provider);
  const contractSigner = new ethers.Contract(contractAddress, abi, signer);
  // const result = await contractSigner.retrieve();
  // console.log("Retrieved value:", result.toString());
  const result2 = await contractSigner.store("123");
  console.log("Stored value:", result2);
  // (async () => {
  //   try {
  //     const result = await contract.retrieve();
  //     console.log("Retrieved value:", result); // Output: { 0: <uint256_value> }
  //   } catch (error) {
  //     console.error("Error retrieving value:", error);
  //   }
  // })();
}
