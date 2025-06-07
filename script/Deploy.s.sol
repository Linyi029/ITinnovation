// scripts/Deploy.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PUZToken.sol";
import "../src/TokenManagerFac.sol";
import "../src/CreatePuzz.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // 部署 PUZToken
        PUZToken token = new PUZToken("PUZ Token", "PUZ", 1000);
        console.log("PUZToken deployed to:", address(token));

        // 先部署 CreatePuzz，先給一個暫時地址（先用 address(0)）
        CreatePuzz puzz = new CreatePuzz(address(token), address(0));
        console.log("CreatePuzz deployed to:", address(puzz));

        // 再部署 TokenManagerFactory，這時傳入 CreatePuzz 的地址
        TokenManagerFactory factory = new TokenManagerFactory(address(token), address(puzz));
        console.log("TokenManagerFactory deployed to:", address(factory));

        // 最後回到 CreatePuzz 設定正確的 factory 地址
        puzz.setFactory(address(factory));

        vm.stopBroadcast();
    }
}
