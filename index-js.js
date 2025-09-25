import { createWalletClient, custom, createPublicClient, parseEther, defineChain } from 'https://esm.sh/viem@2.9.0'
import { contractAddress, abi } from './constants-js.js'

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton")
const ethAmountInput = document.getElementById("ethAmount")

let walletClient
let publicClient

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })

        await walletClient.requestAddresses()
        const accounts = await walletClient.getAddresses()

        console.log('hi')
        console.log(accounts)

        connectButton.innerHTML = 'Connected!'
    } else {
        connectButton.innerHTML = 'Please install MetaMask!'
    }
}

async function fund(params) {
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount}...`)

    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        await publicClient.simulateContract({
            address: contractAddress,
            abi,
            functionName: 'fund',
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount)
        })
    } else {
        connectButton.innerHTML = 'Please install MetaMask!'
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
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
    })
    return currentChain
}


connectButton.onclick = connect;
fundButton.onclick = fund
