// src/provider.js
import { ethers } from "ethers";
import deployedAddresses from "../contract/contract.json"; // 儲存部署後的合約地址
import CreatePuzzABI from "../abi/CreatePuzz.json";
import PUZTokenABI from "../abi/PUZToken.json";
import TokenManagerFactoryABI from "../abi/TokenManagerFac.json";

// RPC Provider 連線到本地 Anvil
const ANVIL_RPC_URL = "http://127.0.0.1:8545";
const provider = new ethers.JsonRpcProvider(ANVIL_RPC_URL);

// 如果需要簽署交易（例如呼叫需要權限的 function），要用 Signer
// 注意：這是本地帳戶的 signer，不需要 MetaMask
const getSigner = async () => {
  const accounts = await provider.listAccounts();
  return provider.getSigner(accounts[0]); // 取第一個帳號作 signer
};

// 建立合約實例
const getContracts = async () => {
  const signer = await getSigner();

  const createPuzz = new ethers.Contract(
    deployedAddresses.CreatePuzz,
    CreatePuzzABI.abi,
    signer
  );

  const puzToken = new ethers.Contract(
    deployedAddresses.PUZToken,
    PUZTokenABI.abi,
    signer
  );

  const tokenManagerFactory = new ethers.Contract(
    deployedAddresses.TokenManagerFactory,
    TokenManagerFactoryABI.abi,
    signer
  );

  return { provider, signer, createPuzz, puzToken, tokenManagerFactory };
};

export default getContracts;
