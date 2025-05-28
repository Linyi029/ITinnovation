// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface ITokenManager {
    function takeDeposit(address from, uint amount) external;
    function rewardUser(address to, uint amount) external;
    function burnToken(uint amount) external;
}

contract CreatePuzz is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _puzzCounter;

    struct PuzzStruct {
        uint id;
        address owner;
        string title;
        string description;
        string tags;
        uint prize;
        bool paidOut;
        uint timestamp;
        bool listed;
        uint disputed;
        address[] disputers;
        string answer;
        uint timestamp_end;
        uint timestamp_verified;
    }
    //嘗試紀錄
    struct Attempt {
        uint id;
        uint pId;
        address account;
        bool pass;
    }

    struct UserStruct {
        uint id;
        address account;
    }

    ITokenManager public tokenManager;
    uint public burnRate = 10;

    uint public entryBaseFee = 5e18;
    uint public entryStepFee = 5e17; // 0.5 PUZ

    mapping(uint => PuzzStruct) public puzzListings;
    mapping(uint => Attempt[]) public puzzAttempts;
    mapping(uint => bool) public puzzShowStatus;
    mapping(uint => mapping(address => uint)) public attemptCount;
    mapping(address => uint[]) public puzzAtmptIdByUser;

    uint public nextUserId = 1;
    mapping(address => UserStruct) public users;
    mapping(address => bool) public isRegistered;

    modifier onlyPuzCreater(uint id) {
        require(puzzListings[id].owner == msg.sender, "Not puzzle creator");
        _;
    }

    constructor(address _tokenManager) {
        tokenManager = ITokenManager(_tokenManager);
    }

    function registerOrLogin() public {
        if (!isRegistered[msg.sender]) {
            users[msg.sender] = UserStruct({
                id: nextUserId,
                account: msg.sender
            });
            isRegistered[msg.sender] = true;
            nextUserId++;
        }
    }

    function addPuzzListing(
        string memory title,
        string memory description,
        string memory tags,
        string memory answer,
        uint fixedFee
    ) public {
        require(bytes(title).length > 0, "Please provide a title");
        require(bytes(description).length > 0, "Please provide a description");
        require(bytes(tags).length > 0, "Please provide tags");
        require(fixedFee > 0, "Fixed fee required");

        tokenManager.takeDeposit(msg.sender, fixedFee);

        _puzzCounter.increment();
        uint puzId = _puzzCounter.current();

        PuzzStruct storage puzz = puzzListings[puzId];
        puzz.id = puzId;
        puzz.owner = msg.sender;
        puzz.title = title;
        puzz.description = description;
        puzz.tags = tags;
        puzz.prize = fixedFee;
        puzz.paidOut = false;
        puzz.timestamp = block.timestamp;
        puzz.listed = true;
        puzz.answer = answer;
        puzz.timestamp_end = block.timestamp + 30 days;
        puzz.timestamp_verified = block.timestamp + 7 days;

        puzzShowStatus[puzId] = true;
    }

    function getEntryFee(uint pId) public view returns (uint) {
        return entryBaseFee + puzzAttempts[pId].length * entryStepFee;
    }

    //可重複測試，但每次測試都要交錢
    function attemptPuzzle(uint pId, string memory guess) public nonReentrant {
        require(puzzShowStatus[pId], "Puzzle not active");

        uint numAttempts = puzzAttempts[pId].length;
        uint entryFee = entryBaseFee + (numAttempts * entryStepFee);
        tokenManager.takeDeposit(msg.sender, entryFee);

        puzzListings[pId].prize += entryFee;

        bool pass = (keccak256(abi.encodePacked(guess)) == keccak256(abi.encodePacked(puzzListings[pId].answer)));

        attemptCount[pId][msg.sender] += 1;
        puzzAtmptIdByUser[msg.sender].push(pId);

        Attempt memory newAttempt = Attempt({
            id: numAttempts,
            pId: pId,
            account: msg.sender,
            pass: pass
        });
        puzzAttempts[pId].push(newAttempt);

        if (pass) {
            uint totalPool = puzzListings[pId].prize;
            uint reward = (totalPool * (100 - burnRate)) / 100;
            uint burn = totalPool - reward;

            tokenManager.rewardUser(msg.sender, reward);
            tokenManager.burnToken(burn);

            puzzListings[pId].paidOut = true;
            puzzShowStatus[pId] = false;
        }
    }

    //題目逾時無人解出，出題者可取回獎金中的90%
    function claimExpiredReward(uint pId) external nonReentrant onlyPuzCreater(pId) {
    PuzzStruct storage puzz = puzzListings[pId];
    require(!puzz.paidOut, "Already paid out");
    require(block.timestamp > puzz.timestamp_end, "Puzzle not expired yet");
    require(puzz.prize > 0, "No prize to claim");

    uint totalPool = puzz.prize;
    uint reward = (totalPool * (100 - burnRate)) / 100;
    uint burn = totalPool - reward;

    tokenManager.rewardUser(puzz.owner, reward);
    tokenManager.burnToken(burn);

    puzz.paidOut = true;
    puzzShowStatus[pId] = false;
}

}
