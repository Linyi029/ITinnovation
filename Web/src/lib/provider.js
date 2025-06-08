// // src/provider.js
// import { ethers } from "ethers";
// import deployedAddresses from "../contract/contract.json"; // 儲存部署後的合約地址
// import CreatePuzz from "../contract.json";
// import PUZTokenABI from "../contract.json";
// import TokenManagerFactoryABI from "../contract.json";

// // RPC Provider 連線到本地 Anvil
// const ANVIL_RPC_URL = "http://127.0.0.1:8545";
// const provider = new ethers.JsonRpcProvider(ANVIL_RPC_URL);

// // 如果需要簽署交易（例如呼叫需要權限的 function），要用 Signer
// // 注意：這是本地帳戶的 signer，不需要 MetaMask
// const getSigner = async () => {
//   const accounts = await provider.listAccounts();
//   return provider.getSigner(accounts[0]); // 取第一個帳號作 signer
// };

// // 建立合約實例
// const getContracts = async () => {
//   const signer = await getSigner();

//   const createPuzz = new ethers.Contract(
//     deployedAddresses.CreatePuzz,
//     CreatePuzz.abi,
//     signer
//   );

//   const puzToken = new ethers.Contract(
//     deployedAddresses.PUZToken,
//     PUZTokenABI.abi,
//     signer
//   );

//   const tokenManagerFactory = new ethers.Contract(
//     deployedAddresses.TokenManagerFactory,
//     TokenManagerFactoryABI.abi,
//     signer
//   );

//   return { provider, signer, createPuzz, puzToken, tokenManagerFactory };
// };

// export default getContracts;

import { ethers } from 'ethers';
import contracts from './contracts.json'
import { setGlobalState } from './store'//還沒寫

const createPuzzAddress = contracts.CreatePuzz.address

export const getContract = async () => {
  const { ethereum } = window

  if (!ethereum) throw new Error('Please install MetaMask')

  const accounts = await ethereum.request({ method: 'eth_accounts' })

  const provider = accounts.length
    ? new ethers.providers.Web3Provider(ethereum)
    : new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC_URL)

  const signerOrProvider = accounts.length
    ? provider.getSigner()
    : provider

  const contract = new ethers.Contract(createPuzzAddress, abi, signerOrProvider)
  return contract
}

export const isWalletConnected = async () => {
  try {
    const { ethereum } = window
    if (!ethereum) {
      console.warn('Please install MetaMask')
      return
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length > 0) {
      const account = accounts[0]
      setGlobalState('connectedAccount', account)
    } else {
      setGlobalState('connectedAccount', '')
      console.log('No accounts found')
    }

    // Optional: you may want to reload contract-dependent state here
    // await loadData()

    // Chain change → reload page
    ethereum.on('chainChanged', () => window.location.reload())

    // Account change → update state
    ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length) {
        setGlobalState('connectedAccount', accounts[0])
        console.log('Account changed:', accounts[0])
        // Optional: reload data or UI
        // await loadData()
      } else {
        setGlobalState('connectedAccount', '')
      }
    })
  } catch (error) {
    console.error('Wallet connection check failed:', error)
  }
}


export const connectWallet = async () => {
  try {
    if (!window.ethereum) return alert('Please install Metamask')
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])

    const createPuzz = await getContract('CreatePuzz')  // ✅ 改為指定合約名稱
    const tx = await createPuzz.registerOrLogin()
    await tx.wait()

    console.log('✅ registerOrLogin tx mined:', tx.hash)
  } catch (error) {
    console.error(error)
    // reportError(error) 你有定義這函式就留著，沒有就拿掉
  }
}

// 封裝 createAndAddWithNewManager 功能
export const createAndAddWithNewManager = async (signer, { title, description, tags, answer, fixedFee }) => {
  try {
    const contract = getContract(signer);

    // 呼叫合約函式
    const tx = await contract.createAndAddWithNewManager(title, description, tags, answer, fixedFee);

    console.log("⏳ Transaction submitted:", tx.hash);
    const receipt = await tx.wait();

    console.log("✅ Transaction confirmed:", receipt.transactionHash);
    // 從事件或 return 值中獲得新的 puzzleId
    const puzzleId = receipt.events?.find((e) => e.event === "Transfer")?.args?.tokenId || null;
    
    return { success: true, puzzleId, txHash: receipt.transactionHash };
  } catch (error) {
    console.error("❌ Error in createPuzzle:", error);
    return { success: false, error };
  }
};
