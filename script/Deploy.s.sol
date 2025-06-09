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

        address user1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        address user2 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        address user3 = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        address user4 = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        address user5 = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        address user6 = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        address user7 = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        address user8 = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;
        address user9 = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;

        token.transfer(user1, 100 * 1e18);
        token.transfer(user2, 100 * 1e18);
        token.transfer(user3, 100 * 1e18);
        token.transfer(user4, 100 * 1e18);
        token.transfer(user5, 100 * 1e18);
        token.transfer(user6, 100 * 1e18);
        token.transfer(user7, 100 * 1e18);
        token.transfer(user8, 100 * 1e18);
        token.transfer(user9, 100 * 1e18);

        vm.stopBroadcast();
    }
}
