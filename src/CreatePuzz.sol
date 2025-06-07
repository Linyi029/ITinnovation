// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./PUZToken.sol";
import "./TokenManager.sol";
import "./TokenManagerFac.sol";

contract CreatePuzz is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    PUZToken public token;
    TokenManagerFactory public factory;

    Counters.Counter private _puzzCounter;

    struct PuzzStruct {
        uint256 id;
        address owner;
        string title;
        string description;
        string tags;
        uint256 prize;
        bool paidOut;
        uint256 timestamp;
        bool listed;
        uint256 disputed; //optional
        address[] disputers; //optional
        string answer;
        uint256 timestamp_end;
        uint256 timestamp_verified; //optional
        address puzPrizeManager;
    }

    struct Attempt {
        uint256 id;
        uint256 pId;
        address account;
        bool pass;
    }

    struct UserStruct {
        uint256 id;
        address account;
    }

    uint256 public burnRate = 10;
    uint256 public entryBaseFee = 5e18;
    uint256 public entryStepFee = 5e17; // 0.5 PUZ

    mapping(uint256 => PuzzStruct) public puzzListings;
    mapping(uint256 => Attempt[]) public puzzAttempts;
    mapping(uint256 => bool) public puzzShowStatus;
    mapping(uint256 => mapping(address => uint256)) public attemptCount;
    mapping(address => uint256[]) public puzzAtmptIdByUser;

    uint256 public nextUserId = 1;
    mapping(address => UserStruct) public users;
    mapping(address => bool) public isRegistered;

    modifier onlyPuzCreater(uint256 id) {
        require(puzzListings[id].owner == msg.sender, "Not puzzle creator");
        _;
    }

    constructor(address _token, address _factory) {
        token = PUZToken(_token);
        factory = TokenManagerFactory(_factory);
    }

    function registerOrLogin() public {
        if (!isRegistered[msg.sender]) {
            users[msg.sender] = UserStruct({id: nextUserId, account: msg.sender});
            isRegistered[msg.sender] = true;
            nextUserId++;
        }
    }

    function createAndAddWithNewManager(
        string memory title,
        string memory description,
        string memory tags,
        string memory answer,
        uint256 fixedFee //入場手續費，要改成公定價提出（其實不改也沒差），不要讓user自己設
    ) public returns (uint256) {
        require(fixedFee > 0, "Need prize"); //入場手續費，要改成公定價提出，不要讓user自己設

        _puzzCounter.increment();
        uint256 puzId = _puzzCounter.current();

        address manager = factory.createTokenManager(puzId); //創建獎金池
        require(manager != address(0), "Manager creation failed");

        IERC20(token).transferFrom(msg.sender, manager, fixedFee);

        puzzListings[puzId] = PuzzStruct({
            id: puzId,
            owner: msg.sender,
            title: title,
            description: description,
            tags: tags,
            prize: fixedFee,
            paidOut: false,
            timestamp: block.timestamp,
            listed: true,
            disputed: 0,
            disputers: new address[](0),
            answer: answer,
            timestamp_end: block.timestamp + 30 days,
            timestamp_verified: block.timestamp + 7 days,
            puzPrizeManager: manager
        });

        puzzShowStatus[puzId] = true;
        return puzId;
    }

    //入場費'bonding curve'，越晚入場越貴
    function getEntryFee(uint256 pId) public view returns (uint256) {
        return entryBaseFee + puzzAttempts[pId].length * entryStepFee;
    }

    function attemptPuzzle(uint256 pId, string memory guess) public nonReentrant {
        require(puzzShowStatus[pId], "Puzzle not active");
        uint256 numAttempts = puzzAttempts[pId].length;
        uint256 entryFee = getEntryFee(pId);

        //交錢
        IERC20(token).transferFrom(msg.sender, puzzListings[pId].puzPrizeManager, entryFee);

        puzzListings[pId].prize += entryFee;

        bool pass = (keccak256(abi.encodePacked(guess)) == keccak256(abi.encodePacked(puzzListings[pId].answer)));

        attemptCount[pId][msg.sender] += 1;
        puzzAtmptIdByUser[msg.sender].push(pId);

        Attempt memory newAttempt = Attempt({id: numAttempts, pId: pId, account: msg.sender, pass: pass});
        puzzAttempts[pId].push(newAttempt);

        if (pass) {
            uint256 totalPool = puzzListings[pId].prize;
            uint256 reward = (totalPool * (100 - burnRate)) / 100;
            uint256 burn = totalPool - reward;

            TokenManager(puzzListings[pId].puzPrizeManager).rewardUser(msg.sender, reward);
            TokenManager(puzzListings[pId].puzPrizeManager).burnToken(burn);

            puzzListings[pId].paidOut = true;
            puzzShowStatus[pId] = false;
        }
    }

    //題目逾期，90%返還給出題者
    function claimExpiredReward(uint256 pId) external nonReentrant onlyPuzCreater(pId) {
        PuzzStruct storage puzz = puzzListings[pId];
        require(!puzz.paidOut, "Already paid out");
        require(block.timestamp > puzz.timestamp_end, "Puzzle not expired yet");
        require(puzz.prize > 0, "No prize to claim");

        uint256 totalPool = puzz.prize;
        uint256 reward = (totalPool * (100 - burnRate)) / 100;
        uint256 burn = totalPool - reward;

        TokenManager(puzz.puzPrizeManager).rewardUser(puzz.owner, reward);
        TokenManager(puzz.puzPrizeManager).burnToken(burn);

        puzz.paidOut = true;
        puzzShowStatus[pId] = false;
    }

    //setter，用於自動部署合約
    function setFactory(address _factory) external onlyOwner {
        factory = TokenManagerFactory(_factory);
    }

    function getActivePuzzles() public view returns (PuzzStruct[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= _puzzCounter.current(); i++) {
            if (puzzShowStatus[i] && !puzzListings[i].paidOut && block.timestamp <= puzzListings[i].timestamp_end) {
                count++;
            }
        }

        PuzzStruct[] memory active = new PuzzStruct[](count);
        uint256 idx;
        for (uint256 i = 1; i <= _puzzCounter.current(); i++) {
            if (puzzShowStatus[i] && !puzzListings[i].paidOut && block.timestamp <= puzzListings[i].timestamp_end) {
                active[idx++] = puzzListings[i];
            }
        }

        return active;
    }

    function getMyPuzzles() public view returns (PuzzStruct[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= _puzzCounter.current(); i++) {
            if (puzzListings[i].owner == msg.sender) {
                count++;
            }
        }

        PuzzStruct[] memory myPuzz = new PuzzStruct[](count);
        uint256 idx;
        for (uint256 i = 1; i <= _puzzCounter.current(); i++) {
            if (puzzListings[i].owner == msg.sender) {
                myPuzz[idx++] = puzzListings[i];
            }
        }

        return myPuzz;
    }

    function getAttemptedPuzzles() public view returns (PuzzStruct[] memory) {
        uint256[] memory ids = puzzAtmptIdByUser[msg.sender];
        PuzzStruct[] memory results = new PuzzStruct[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            results[i] = puzzListings[ids[i]];
        }

        return results;
    }

    function getMyAttempts() public view returns (Attempt[] memory) {
        uint256 count;
        for (uint256 i = 1; i <= _puzzCounter.current(); i++) {
            for (uint256 j = 0; j < puzzAttempts[i].length; j++) {
                if (puzzAttempts[i][j].account == msg.sender) {
                    count++;
                }
            }
        }

        Attempt[] memory myAttempts = new Attempt[](count);
        uint256 idx;
        for (uint256 i = 1; i <= _puzzCounter.current(); i++) {
            for (uint256 j = 0; j < puzzAttempts[i].length; j++) {
                if (puzzAttempts[i][j].account == msg.sender) {
                    myAttempts[idx++] = puzzAttempts[i][j];
                }
            }
        }

        return myAttempts;
    }

    function getPassStatus(uint256 pId) public view returns (bool iPassed, bool anyonePassed) {
        Attempt[] memory attempts = puzzAttempts[pId];
        bool mine = false;
        bool any = false;

        for (uint256 i = 0; i < attempts.length; i++) {
            if (attempts[i].pass) {
                any = true;
            }
            if (attempts[i].account == msg.sender && attempts[i].pass) {
                mine = true;
            }
        }

        return (mine, any);
    }

    function getPuzPrizeManager(uint256 pId) public view returns (address) {
        return puzzListings[pId].puzPrizeManager;
    }
}
