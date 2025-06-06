// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PUZToken.sol";
import "./TokenManager.sol";

//用於每次出題時自動產生合約

contract TokenManagerFactory {
    address public immutable token;
    address public immutable createPuzz;
    address public immutable iniOwner;

    mapping(uint256 => address) public puzzleToManager;

    event TokenManagerCreated(uint256 indexed puzId, address manager);

    constructor(address _token, address _createPuzz) {
        token = _token;
        createPuzz = _createPuzz;
    }

    function createTokenManager(uint256 puzId) external returns (address) {
        require(puzzleToManager[puzId] == address(0), "Already created");

        TokenManager tm = new TokenManager(token, createPuzz, iniOwner);
        puzzleToManager[puzId] = address(tm);

        emit TokenManagerCreated(puzId, address(tm));
        return address(tm);
    }
}
