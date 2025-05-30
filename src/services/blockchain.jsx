import { setGlobalState, getGlobalState } from '../store'
import abi from '../abis/src/contracts/DappWorks.sol/DappWorks.json'
import address from '../abis/contractAddress.json'
import { ethers } from 'ethers'
// import { logOutWithCometChat } from './chat'

const { ethereum } = window
const ContractAddress = address.address
const ContractAbi     = abi.abi
// let tx

const toWei   = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

async function getEthereumContract() {
  const accounts = await ethereum.request({ method: 'eth_accounts' })
  const provider = accounts[0]
    ? new ethers.providers.Web3Provider(ethereum)
    : new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
  const wallet = accounts[0] ? null : ethers.Wallet.createRandom()
  const signer = provider.getSigner(accounts[0] ? undefined : wallet.address)

  const contract = new ethers.Contract(ContractAddress, ContractAbi, signer)
  return contract
}

export const loadData = async () => {
  // all getters
  // await getJobs()
  // await getMyJobs()
  // await getMyGigs()
  // await getMyBidJobs()
}

export const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      reportError('Please install Metamask')
      return Promise.reject(new Error('Metamask not installed'))
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      console.log('No accounts found.')
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0])
      console.log('Account changed: ', accounts[0])
      await loadData()
      await isWalletConnected()
      logOutWithCometChat()
    })
    await loadData()

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      setGlobalState('connectedAccount', '')
      console.log('No accounts found')
    }
  } catch (error) {
    reportError(error)
  }
}

export const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])

    // 2. 拿到合约实例
    const contract = await getEthereumContract()

    // 3. 触发 registerOrLogin()，第一次会注册、以后调用就相当于登录
    const tx = await contract.registerOrLogin()
    await tx.wait()

    console.log('✅ registerOrLogin tx mined:', tx.hash)

  } catch (error) {
    console.error(error)
    reportError(error)
  }
}

// Actions
// export const registerOrLogin = async () => {
//   const contract = await getEthereumContract()
//   const tx = await contract.registerOrLogin()
//   await tx.wait()
// }

// create a new puzzle
export const addPuzzListing = async ({ title, description, tags, answer, fee }) => {
  if (!ethereum) return alert('Please install Metamask')
  try{  
    const contract = await getEthereumContract()
    const tx = await contract.addPuzzListing(title, description, tags, answer, toWei(fee))
    await tx.wait()
    await loadData()
  }catch(err){
    reportError(err)
  }
}

// compute entry fee
export const getEntryFee = async (pId) => {
  const contract = await getEthereumContract()
  const fee = await contract.getEntryFee(pId)
  return fromWei(fee)
}

// delete a puzzle
export const deletePuzzle = async (id) => {
  const contract = await getEthereumContract()
  const tx = await contract.deleteJob(id)
  await tx.wait()
}

// update a puzzle
export const updatePuzzle = async ({ id, title, description, tags, answer }) => {
  const contract = await getEthereumContract()
  const tx = await contract.updateJob(id, title, description, tags, answer)
  await tx.wait()
}

// attempt a puzzle
export const attemptPuzzle = async ({ id, guess }) => {
  const contract = await getEthereumContract()
  const tx = await contract.attemptPuzzle(id, guess)
  await tx.wait()
}

// claim expired reward
export const claimExpiredReward = async (id) => {
  const contract = await getEthereumContract()
  const tx = await contract.claimExpiredReward(id)
  await tx.wait()
}

// count total attempts
export const countTotalBids = async (id) => {
  const contract = await getEthereumContract()
  return (await contract.countTotalBids(id)).toNumber()
}

// Getters
export const getAllPuzzle = async () => {
  const contract = await getEthereumContract()
  const [all, rel] = await contract.getAllPuzzle()
  return {
    puzzles: all.map(p => ({
      ...p,
      prize: fromWei(p.prize)
    })),
    relations: rel.map(r => r.toNumber())
  }
}

export const getMyRelationshipWithPuzzle = async (id) => {
  const contract = await getEthereumContract()
  return (await contract.getMyRelationshipWithPuzzle(id)).toNumber()
}

export const getMyAttempted = async () => {
  const contract = await getEthereumContract()
  const attempts = await contract.getMyAttempted()
  return attempts.map(a => ({
    id: a.id.toNumber(),
    pId: a.pId.toNumber(),
    pass: a.pass
  }))
}

export const getMyAttemptedPuzzle = async () => {
  const contract = await getEthereumContract()
  const ps = await contract.getMyAttemptedPuzzle()
  return ps.map(p => ({ ...p, prize: fromWei(p.prize) }))
}

export const getMyPuzzle = async () => {
  const contract = await getEthereumContract()
  const ps = await contract.getMyPuzzle()
  return ps.map(p => ({ ...p, prize: fromWei(p.prize) }))
}

export const getPuzzle = async (id) => {
  const contract = await getEthereumContract()
  const p = await contract.getPuzzle(id)
  return { ...p, prize: fromWei(p.prize) }
}
