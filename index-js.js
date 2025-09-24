import { createWalletClient, custom, createPublicClient } from 'https://esm.sh/viem@2.9.0'
// import { mainnet } from 'https://esm.sh/viem@2.9.0/chains'

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
        await walletClient.requestAddresses()

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        await publicClient.simulateContract({
            address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
            abi: wagmiAbi,
            functionName: 'mint',
            account,
        })
    } else {
        connectButton.innerHTML = 'Please install MetaMask!'
    }
}

connectButton.onclick = connect;
fundButton.onclick = fund
