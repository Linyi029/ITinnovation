#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// 🔧 專案根目錄（視情況調整）
const BASE_PATH = "C:/Users/julie/Web/ITinnovation";

// 📄 Broadcast 檔案
const broadcastPath = path.join(BASE_PATH, "broadcast/Deploy.s.sol/31337/run-latest.json");
const broadcastData = JSON.parse(fs.readFileSync(broadcastPath, "utf8"));

// 🧩 通常合約（合約名 = 檔名 = contract class name）
const CONTRACTS = ["PUZToken", "CreatePuzz"];
const output = {};

for (const contractName of CONTRACTS) {
  const artifactPath = path.join(BASE_PATH, `out/${contractName}.sol/${contractName}.json`);
  if (!fs.existsSync(artifactPath)) {
    console.warn(`⚠️ 無 ${contractName}.json，略過`);
    continue;
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const tx = broadcastData.transactions.find(tx => tx.contractName === contractName);

  if (!tx) {
    console.warn(`⚠️ 找不到 ${contractName} 的部署紀錄，略過`);
    continue;
  }

  output[contractName] = {
    abi: artifact.abi,
    address: tx.contractAddress
  };
  console.log(`✅ ${contractName} 已加入`);
}

// 🔧 特例處理：TokenManagerFac.sol → TokenManagerFactory
const tokenManagerFacPath = path.join(BASE_PATH, "out/TokenManagerFac.sol/TokenManagerFactory.json");
if (fs.existsSync(tokenManagerFacPath)) {
  const tokenManagerFacJson = JSON.parse(fs.readFileSync(tokenManagerFacPath, "utf8"));

  const txTokenManagerFac = broadcastData.transactions.find(
    tx => tx.contractName === "TokenManagerFactory"
  );

  if (txTokenManagerFac) {
    output["TokenManagerFactory"] = {
      abi: tokenManagerFacJson.abi,
      address: txTokenManagerFac.contractAddress
    };
    console.log("✅ TokenManagerFactory 資訊已加入");
  } else {
    console.warn("⚠️ 找不到 TokenManagerFactory 的交易紀錄");
  }
} else {
  console.warn("⚠️ 找不到 TokenManagerFactory.json");
}

// ✅ 輸出結果
const outputPath = path.join(__dirname, "/Web/contracts.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`📦 ABI 與地址已輸出至 ${outputPath}`);
