import { BrowserProvider, JsonRpcProvider, Contract } from 'ethers';
import contracts from '../../contracts.json';
import { setGlobalState } from './store.jsx';

const createPuzzAddress = contracts.CreatePuzz.address;
const abi = contracts.CreatePuzz.abi;

export const getContract = async () => {
  if (!window.ethereum) throw new Error('Please install MetaMask');

  const provider = await detectProvider();
  const signerOrProvider = await getSignerOrProvider(provider);

  const contract = new Contract(createPuzzAddress, abi, signerOrProvider);
  return contract;
};

const detectProvider = async () => {
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });

  if (accounts.length) {
    return new BrowserProvider(window.ethereum);
  } else {
    return new JsonRpcProvider(import.meta.env.VITE_RPC_URL);
  }
};

const getSignerOrProvider = async (provider) => {
  // BrowserProvider 需要 async getSigner()
  if (provider instanceof BrowserProvider) {
    return await provider.getSigner();
  } else {
    return provider;
  }
};

export const isWalletConnected = async () => {
  try {
    if (!window.ethereum) {
      console.warn('Please install MetaMask');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length > 0) {
      setGlobalState('connectedAccount', accounts[0]);
    } else {
      setGlobalState('connectedAccount', '');
      console.log('No accounts found');
    }

    window.ethereum.on('chainChanged', () => window.location.reload());

    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length) {
        setGlobalState('connectedAccount', accounts[0]);
        console.log('Account changed:', accounts[0]);
      } else {
        setGlobalState('connectedAccount', '');
      }
    });
  } catch (error) {
    console.error('Wallet connection check failed:', error);
  }
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setGlobalState('connectedAccount', accounts[0]);

    const createPuzz = await getContract();
    const tx = await createPuzz.registerOrLogin();
    await tx.wait();

    console.log('✅ registerOrLogin tx mined:', tx.hash);
  } catch (error) {
    console.error('connectWallet error:', error);
  }
};


export async function submitPuzzle(formData) {
  if (!ethereum) return alert('Please install Metamask');
  
  const createPuzz = await getContract('CreatePuzz');

  const signer = await getSignerOrProvider(await detectProvider());
  const puzTokenAddress = contracts.PUZToken.address;
  const puzAbi = contracts.PUZToken.abi;
  const PUZToken = new Contract(puzTokenAddress, puzAbi, signer);
  const approvalTx = await PUZToken.approve(createPuzzAddress, formData.fixedFee);
  await approvalTx.wait();
  console.log('✅ PUZToken approved');


  // 假設你 formData 結構是 { title, description, tags, answer, fixedFee }
  // fixedFee 是 uint256 (wei 單位)
  const tx = await createPuzz.createAndAddWithNewManager(
    formData.title,
    formData.description,
    formData.tags,
    formData.answer,
    formData.fixedFee // 例如 '2000000000000000000' (2 PUZ)
  );

  const receipt = await tx.wait();
  return receipt.transactionHash;
}

export const fetchActivePuzzles = async () => {
  try {
    const createPuzz = await getContract('CreatePuzz');
    const puzzles = await createPuzz.getActivePuzzles();

    return puzzles.map((puzz) => ({
      id: Number(puzz.id),
      title: puzz.title,
      author: puzz.owner,
      question: puzz.description,
      label: puzz.tags.split(","),
      time: new Date(Number(puzz.timestamp) * 1000).toLocaleDateString(),
      daysleft: Math.ceil((Number(puzz.timestamp_end) - Math.floor(Date.now() / 1000)) / 86400),
      status: puzz.paidOut ? "inactive" : "active",
    }));
  } catch (err) {
    console.error("❌ Failed to fetch puzzles:", err);
    return [];
  }
};

export const fetchAllPuzzles = async () => {
  try {
    const createPuzz = await getContract('CreatePuzz');
    const puzzles = await createPuzz.getAllPuzzles();

    return puzzles.map((puzz) => ({
      id: Number(puzz.id),
      title: puzz.title,
      author: puzz.owner,
      question: puzz.description,
      label: puzz.tags.split(","),
      time: new Date(Number(puzz.timestamp) * 1000).toLocaleDateString(),
      daysleft: Math.ceil((Number(puzz.timestamp_end) - Math.floor(Date.now() / 1000)) / 86400),
      status: puzz.paidOut ? "inactive" : "active",
    }));
  } catch (err) {
    console.error("❌ Failed to fetch puzzles:", err);
    return [];
  }
};

export const getPuzzleById = async (id) => {
  const contracts = await getContract('CreatePuzz'); // 你應該拿到的是 createPuzz 的合約物件集合
  const data = await contracts.createPuzz.getPuzzleById(id); // 🔧 呼叫正確的函數名

  return {
    id: id,
    title: data.title,
    author: data.owner,
    question: data.description,
    labels: data.tags.split(',').map((tag) => tag.trim()), // tag 是 "AI,Math,Beginner" 這樣的字串
  };
};
