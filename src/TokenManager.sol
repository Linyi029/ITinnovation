// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./PUZToken.sol";

//獎金池的功能，可以理解為錢會轉到具備這些功能的獎金池

contract TokenManager is Ownable {
    IERC20 public immutable token;
    address public immutable createPuzz;

    modifier onlyCreatePuzz() {
        require(msg.sender == createPuzz, "Only CreatePuzz can call");
        _;
    }

    constructor(address _token, address _createPuzz) {
        token = IERC20(_token);
        createPuzz = _createPuzz;
    } //用什麼錢，這個獎金池對應的puzzle地址

    function takeDeposit(address from, uint256 amount) external onlyCreatePuzz {
        require(token.transferFrom(from, address(this), amount), "Transfer failed");
    }

    function rewardUser(address to, uint256 amount) external onlyCreatePuzz {
        require(token.transfer(to, amount), "Reward transfer failed");
    }

    function burnToken(uint256 amount) external onlyCreatePuzz {
        PUZToken(address(token)).burn(amount);
    }
}
