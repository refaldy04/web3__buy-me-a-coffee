import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
  WalletClient,
  PublicClient,
  Chain,
} from "viem";
import "viem/window";
import { contractAddress, abi } from "./constants-ts";

// Type assertions for DOM elements
const connectButton = document.getElementById(
  "connectButton"
) as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
const balanceButton = document.getElementById(
  "balanceButton"
) as HTMLButtonElement;
const withdrawButton = document.getElementById(
  "withdrawButton"
) as HTMLButtonElement;

console.log("HIIIII");
// Client variables with type annotations
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;

async function connect(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    await walletClient.requestAddresses();
    const accounts = await walletClient.getAddresses();

    console.log("Connected accounts:", accounts);

    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

async function fund(): Promise<void> {
  const ethAmount = ethAmountInput.value;
  console.log(`Funding with ${ethAmount}...`);

  if (typeof window.ethereum !== "undefined" && walletClient) {
    const [connectedAccount] = await walletClient.requestAddresses();

    if (!connectedAccount) {
      console.error("No connected account found");
      return;
    }

    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi,
        functionName: "fund",
        account: connectedAccount,
        chain: currentChain,
        value: parseEther(ethAmount),
      });

      const hash = await walletClient.writeContract(request);
      console.log("Transaction hash:", hash);
    } catch (error) {
      console.error("Error funding contract:", error);
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
  const chainId = await client.getChainId();

  const currentChain = defineChain({
    id: chainId,
    name: "Custom Chain",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ["http://localhost:8545"],
      },
    },
  });

  return currentChain;
}

async function getBalance(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const balance = await publicClient.getBalance({
      address: contractAddress,
    });

    console.log(`Contract balance: ${formatEther(balance)} ETH`);
  }
}

async function withdraw(): Promise<void> {
  console.log("Withdrawing...");

  if (typeof window.ethereum !== "undefined" && walletClient) {
    const [connectedAccount] = await walletClient.requestAddresses();

    if (!connectedAccount) {
      console.error("No connected account found");
      return;
    }

    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    try {
      const { request } = await publicClient.simulateContract({
        address: contractAddress,
        abi,
        functionName: "withdraw",
        account: connectedAccount,
        chain: currentChain,
      });

      const hash = await walletClient.writeContract(request);
      console.log("Withdrawal transaction hash:", hash);
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask!";
  }
}

// Event listeners with null checks
if (connectButton) connectButton.onclick = connect;
if (fundButton) fundButton.onclick = fund;
if (balanceButton) balanceButton.onclick = getBalance;
if (withdrawButton) withdrawButton.onclick = withdraw;

// anvil --load-state fundme-anvil.json --host 0.0.0.0 --port 8545
