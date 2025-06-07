import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 模擬 CommonJS 的 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// provider 和 signer 設定（本地 Anvil）
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const deployer = await provider.getSigner(0);
const owner = await deployer.getAddress();

// 讀取 ABI + Bytecode
const loadContract = (name) => {
  const contractPath = path.resolve(__dirname, "../abi", `${name}.json`);
  const contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  const abi = contractJson.abi || contractJson.data?.abi;
  const bytecode = contractJson.bytecode?.object || contractJson.data?.bytecode?.object;
  if (!abi || !bytecode) {
    throw new Error(`❌ 無法從 ${name}.json 找到 ABI 或 Bytecode`);
  }
  return { abi, bytecode };
};

// 讀取已部署的地址
const contractJsonPath = path.resolve(__dirname, "./contract.json");
let deployedAddresses = {};
if (fs.existsSync(contractJsonPath)) {
  deployedAddresses = JSON.parse(fs.readFileSync(contractJsonPath, "utf8"));
}

const main = async () => {
  // 1. PUZToken
  if (!deployedAddresses.PUZToken) {
    const { abi, bytecode } = loadContract("PUZToken");
    const factory = new ethers.ContractFactory(abi, bytecode, deployer);
    const token = await factory.deploy("PUZ Token", "PUZ", 1000000, owner, {});
    await token.waitForDeployment();
    deployedAddresses.PUZToken = token.target;
    console.log("✅ PUZToken deployed at:", token.target);
  } else {
    console.log("🔁 PUZToken 已部署，跳過");
  }

  // 2. CreatePuzz
  if (!deployedAddresses.CreatePuzz) {
    const { abi, bytecode } = loadContract("CreatePuzz");
    const factory = new ethers.ContractFactory(abi, bytecode, deployer);
    const dummyFactoryAddress = ethers.ZeroAddress;
    const createPuzz = await factory.deploy(deployedAddresses.PUZToken, dummyFactoryAddress, owner, {});
    await createPuzz.waitForDeployment();
    deployedAddresses.CreatePuzz = createPuzz.target;
    console.log("✅ CreatePuzz deployed at:", createPuzz.target);
  } else {
    console.log("🔁 CreatePuzz 已部署，跳過");
  }

  // 3. TokenManagerFac
  if (!deployedAddresses.TokenManagerFac) {
    const { abi, bytecode } = loadContract("TokenManagerFac");
    const factory = new ethers.ContractFactory(abi, bytecode, deployer);
    const tokenManagerFac = await factory.deploy(deployedAddresses.PUZToken, deployedAddresses.CreatePuzz);

    await tokenManagerFac.waitForDeployment();
    deployedAddresses.TokenManagerFac = tokenManagerFac.target;
    console.log("✅ TokenManagerFac deployed at:", tokenManagerFac.target);
  } else {
    console.log("🔁 TokenManagerFac 已部署，跳過");
  }

  // 儲存最新部署地址
  fs.writeFileSync(contractJsonPath, JSON.stringify(deployedAddresses, null, 2));
  console.log("📦 合約地址已儲存到 contract.json");
};

main().catch((err) => {
  console.error("❌ Error deploying contracts:", err);
});
