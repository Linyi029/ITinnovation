// src/provider.js
import { ethers } from "ethers";
//import deployedContracts from "../contracts.json"; 
import deployedAddresses from "../../contracts.json"; // 儲存部署後的合約地址

// RPC Provider 連線到本地 Anvil
const ANVIL_RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(ANVIL_RPC_URL);

// 如果需要簽署交易（例如呼叫需要權限的 function），要用 Signer
// 注意：這是本地帳戶的 signer，不需要 MetaMask
const getSigner = async () => {
  const accounts = await provider.listAccounts();
  return provider.getSigner(1); // 取第一個帳號作 signer
};

// 建立合約實例，signer等下都要簽這些合約
const getContracts = async () => {
  const signer = await getSigner();

  const createPuzz = new ethers.Contract(
    deployedAddresses.CreatePuzz.address,   // ← 正確
    deployedAddresses.CreatePuzz.abi,       // ← 用 contract.json 的 abi
    signer
  );

  const puzToken = new ethers.Contract(
    deployedAddresses.PUZToken.address,
    deployedAddresses.PUZToken.abi,
    signer
  );

  const tokenManagerFactory = new ethers.Contract(
    deployedAddresses.TokenManagerFactory.address,
    deployedAddresses.TokenManagerFactory.abi,
    signer
  );



  return { provider, signer, createPuzz, puzToken, tokenManagerFactory };
};
export { getContracts };

//export default getContracts;

export async function submitPuzzle(formData) {
  const { createPuzz } = await getContracts();

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

export const createAndAddWithNewManager = async (signer, { title, description, tags, answer, fixedFee }) => {
  try {
    //const contract = getContract(signer);
    const { createPuzz } = await getContracts();

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
// provider.js
// export const fetchActivePuzzles = async () => {
//   try {
//     const { createPuzz } = await getContracts();
//     const puzzles = await createPuzz.getActivePuzzles();

//     // 將返回的 puzzles（陣列）格式化成適合前端的形式
//     return puzzles.map((puzz, index) => ({
//       id: puzz.id.toNumber(),
//       title: puzz.title,
//       author: puzz.owner,
//       question: puzz.description, // 假設 description 為題幹
//       label: puzz.tags.split(","),
//       time: new Date(puzz.timestamp * 1000).toLocaleDateString(),
//       daysleft: Math.ceil((puzz.timestamp_end - Math.floor(Date.now() / 1000)) / 86400),
//       status: puzz.paidOut ? "inactive" : "active",
//     }));
//   } catch (err) {
//     console.error("❌ Failed to fetch puzzles:", err);
//     return [];
//   }
// };

export const fetchActivePuzzles = async () => {
  try {
    const { createPuzz } = await getContracts();
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
    const { createPuzz } = await getContracts();
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
  const contracts = await getContracts(); // 你應該拿到的是包含 createPuzz 的合約物件集合
  const data = await contracts.createPuzz.getPuzzleById(id); // 🔧 呼叫正確的函數名

  return {
    id: id,
    title: data.title,
    author: data.owner,
    question: data.description,
    labels: data.tags.split(',').map((tag) => tag.trim()), // tag 是 "AI,Math,Beginner" 這樣的字串
  };
};
