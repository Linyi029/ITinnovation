// PUZToken.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// contract address : 0x030d06014750992101558e30181C13D7f3453858
contract PUZToken is ERC20, ERC20Burnable, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        address initialOwner_
    ) ERC20(name_, symbol_) Ownable(initialOwner_) {
        _mint(msg.sender, initialSupply_ * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
