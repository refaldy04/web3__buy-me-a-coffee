import { createWalletClient, custom } from 'https://esm.sh/viem@2.9.0'
// import { mainnet } from 'https://esm.sh/viem@2.9.0/chains'

const connectButton = document.getElementById("connectButton");

let walletClient

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

connectButton.onclick = connect;
