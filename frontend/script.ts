const ethereumButton: Element = document.querySelector(
  ".enableEthereumButton",
)!;
const showAccount: Element = document.querySelector(".showAccount")!;

ethereumButton.addEventListener("click", () => {
  connect();
});

interface Window {
  ethereum: any;
}

async function connect() {
  if (typeof (window as unknown as Window).ethereum !== "undefined") {
    await getAccount();
    // console.log(ethers);
  } else {
    ethereumButton.textContent = "Please install MetaMask!";
  }
}

async function getAccount() {
  const accounts = await (window as unknown as Window).ethereum
    .request({ method: "eth_requestAccounts" })
    .catch((err: { code: number; message: String }) => {
      if (err.code === 4001) {
        ethereumButton.textContent = "Connect to MetaMask";
        console.log(err.message);
      } else {
        console.error(err);
      }
    });
  console.log(accounts);
  ethereumButton.textContent = "Connected";
  const account = accounts[0];
  showAccount.innerHTML = account;
}
