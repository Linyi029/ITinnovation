// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//這裡是獎金池，出題者跟解題者交的錢會轉到這個合約

contract TokenManager is Ownable {
    ERC20Burnable public token;
    address public platform;

    constructor(address _token) {
        token = ERC20Burnable(_token);
        platform = msg.sender;
    }

    function takeDeposit(address from, uint256 amount) external {
        require(token.transferFrom(from, address(this), amount), "Transfer failed");
    }

    function rewardUser(address to, uint256 amount) external {
        require(token.transfer(to, amount), "Reward failed");
    }

    function burnToken(uint256 amount) external {
        token.burn(amount); // 合約必須持有 token 才能 burn
    }

    function withdrawToOwner(uint256 amount) external onlyOwner {
        require(token.transfer(owner(), amount), "Withdraw failed");
    }
}