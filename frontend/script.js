// as in frontend, we use import syntax, we need to add type="module" in the script tag
import { ethers } from "./ethers-6.7.0.esm.min.js";

// or we can use CDN
// import { ethers } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";

// Get the contract address and abi from the contract deployment
// abi --> artifact/content of the contract
// contractAddress --> address of the contract
import { abi, contractAddress } from "./constants.js";

let provider; // provider is the connection to the blockchain (Read Only)
let signer; // signer is the connection to the wallet (Read & Write)
let contractSigner;

const connectButton = document.querySelector(".connectButton");
const disconnectButton = document.querySelector(".disconnectButton");

const showAccount = document.querySelector(".showAccount");

const showValue = document.querySelector(".showValue");

const newValueInput = document.querySelector(".newValue");
const setValueButton = document.querySelector(".setValueButton");
const getValueButton = document.querySelector(".getValueButton");

connectButton.addEventListener("click", () => {
  connect();
});

disconnectButton.addEventListener("click", () => {
  disconnect();
});

setValueButton.addEventListener("click", () => {
  const newValue = newValueInput.value;
  storeValue(newValue);
});

getValueButton.addEventListener("click", () => {
  retrieveValue();
});

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await getAccount();
    enableUI();
    retrieveValue();
  } else {
    connectButton.textContent = "Please install MetaMask!";
  }
}

async function getAccount() {
  const accounts = await window.ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err) => {
      if (err.code === 4001) {
        connectButton.textContent = "Connect to MetaMask";
        console.log(err.message);
      } else {
        console.error(err);
      }
    });
  const account = accounts[0];
  showAccount.innerHTML = account;
  provider = new ethers.BrowserProvider(window.ethereum);
  connectButton.textContent = "Connected";
  signer = await provider.getSigner();
  contractSigner = new ethers.Contract(contractAddress, abi, signer);
}

function enableUI() {
  getValueButton.disabled = false;
  setValueButton.disabled = false;
  disconnectButton.disabled = false;
}

function disableUI() {
  getValueButton.disabled = true;
  setValueButton.disabled = true;
  disconnectButton.disabled = true;
}

function disconnect() {
  // Reset UI and contract signer
  connectButton.textContent = "Connect Wallet";
  showAccount.innerHTML = "";
  showValue.innerHTML = "";
  newValueInput.value = "";
  disableUI();
  provider = null;
  signer = null;
  contractSigner = null;
}

// Can be called by the provider or the signer
// eg: contract = new ethers.Contract(contractAddress, abi, provider);
async function retrieveValue() {
  const result = await contractSigner.retrieve();
  showValue.innerHTML = result.toString();
}

// Can only be called by the signer
async function storeValue(newValue) {
  const result = await contractSigner.store(newValue);
  await result.wait();
  console.log("TxReceipt:", result);
  retrieveValue();
}

// async function Test() {
//   provider = new ethers.BrowserProvider(window.ethereum);
//   console.log("Provider: ", provider);
//   signer = await provider.getSigner();
//   console.log("Signer: ", signer);
//   const contractProvider = new ethers.Contract(contractAddress, abi, provider);
//   const contractSigner = new ethers.Contract(contractAddress, abi, signer);

//   console.log("Contract Provider: ", contractProvider);
//   console.log("Contract Signer: ", contractSigner);

//   const result = await contractSigner.retrieve();
//   console.log("Retrieved value:", result.toString());
//   const result2 = await contractSigner.store(69);
//   await result2.wait();
//   console.log("Stored value:", result2);

//   const result3 = await contractProvider.retrieve();
//   console.log("Retrieved value:", result3.toString());
// }
