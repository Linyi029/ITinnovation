// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITokenManager {
    function takeDeposit(address from, uint256 amount) external;
    function rewardUser(address to, uint256 amount) external;
    function burnToken(uint256 amount) external;
}

contract DappWorks is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _puzzCounter;

    struct PuzzStruct {
        uint256 id;
        address owner;
        string title;
        string description;
        string tags;
        uint256 prize;
        bool paidOut; //被解開與否
        uint256 timestamp; //創建日期
        bool listed; //要不要列再頁面上，預設true，//puzzle有沒有被刪除(刪除了還在鏈上，只是listed、puzzShowStatus會是false)
        uint256 disputed; //被檢舉幾次
        address[] disputers; //被那些人檢舉
        string answer;
        uint256 timestamp_end; // 創建者可自己訂，預設1個月
        uint256 timestamp_verified; // end + 7天
    }

    struct UserStruct {
        uint256 id;
        address account;
    }

    //嘗試紀錄
    struct Attempt {
        uint256 id;
        uint256 pId;
        address account;
        bool pass;
    }

    ITokenManager public tokenManager;
    uint256 public burnRate = 10;

    uint256 public entryBaseFee = 5e18;
    uint256 public entryStepFee = 5e17; // 0.5 PUZ

    mapping(uint256 => PuzzStruct) public puzzListings; //所有Puzzles
    mapping(uint256 => Attempt[]) public puzzAttempts; //某個puzzle被多少人嘗試過
    mapping(uint256 => bool) public puzzShowStatus; //puzzle有沒有被刪除(刪除了還在鏈上，只是listed、puzzShowStatus會是false)
    mapping(uint256 => mapping(address => uint256)) public attemptCount; // 原hasPlaceBid
    mapping(address => uint256[]) public puzzAtmptIdByUser;  // 一個user 嘗試答過哪些puzz

    uint256 public nextUserId = 1;
    mapping(address => UserStruct) public users;
    mapping(address => bool) public isRegistered;

    modifier onlyPuzCreater(uint256 id) {
        require(puzzListings[id].owner == msg.sender, "Not puzzle creator");
        _;
    }

    constructor(address _tokenManager) {
        tokenManager = ITokenManager(_tokenManager);
    }

    function registerOrLogin() public {
        if (!isRegistered[msg.sender]) {
            users[msg.sender] = UserStruct({id: nextUserId, account: msg.sender});
            isRegistered[msg.sender] = true;
            nextUserId++;
        }
    }

    function addPuzzListing(
        string memory title,
        string memory description,
        string memory tags,
        string memory answer,
        uint256 fixedFee // 除去
        // uint256 duration // 單位：天
    ) public {
        require(bytes(title).length > 0, "Please provide a title");
        require(bytes(description).length > 0, "Please provide a description");
        require(bytes(tags).length > 0, "Please provide tags");
        require(fixedFee > 0, "Fixed fee required");

        tokenManager.takeDeposit(msg.sender, fixedFee);

        _puzzCounter.increment();
        uint256 puzId = _puzzCounter.current();

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
        puzz.timestamp_end = block.timestamp + 30 days; //之後可嘗試讓出題者自己設定(+ duration days)
        puzz.timestamp_verified = block.timestamp + 7 days;

        // deel with mapping
        puzzListings[puzId] = puzz;
        puzzShowStatus[puzId] = true;
    }

    function getEntryFee(uint256 pId) public view returns (uint256) {
        return entryBaseFee + puzzAttempts[pId].length * entryStepFee;
    }

    function deleteJob(uint256 id) public {
        require(puzzShowStatus[id], "This puzzle doesn't exist"); // 2擇1
        require(puzzListings[id].listed, "This puzzle doesn't exist"); // 2擇1
        require(!puzzListings[id].paidOut, "This job has been solved");

        puzzShowStatus[id] = false;
        puzzListings[id].listed = false;

        //退錢給出題者
        // payTo(jobListings[id].owner, jobListings[id].prize);
    }

    function updateJob(
        uint256 id,
        string memory jobTitle,
        string memory description,
        string memory tags,
        string memory answer
        // uint256 memory duration
    ) public {
        require(puzzShowStatus[id], "This puzzle doesn't exist"); // 2擇1
        require(puzzListings[id].listed, "This puzzle doesn't exist"); // 2擇1
        require(!puzzListings[id].paidOut, "This job has been solved");

        puzzListings[id].jobTitle = jobTitle;
        puzzListings[id].description = description;
        puzzListings[id].tags = tags;
        puzzListings[id].answer = answer;
        // puzzListings[id].timestamp_end = puzzListings[id].timestamp + duration;

    }

    //可重複測試，但每次測試都要交錢
    function attemptPuzzle(uint256 pId, string memory guess) public nonReentrant {
        require(puzzShowStatus[pId], "Puzzle not active");
        require(puzzListings[id].owner != msg.sender, "Forbidden action!");
        require(!puzzListings[id].paidOut, "This job has been paid out");
        require(puzzListings[id].listed, "This job have been taken");

        uint256 numAttempts = puzzAttempts[pId].length;
        uint256 entryFee = entryBaseFee + (numAttempts * entryStepFee);
        tokenManager.takeDeposit(msg.sender, entryFee);

        puzzListings[pId].prize += entryFee;

        bool pass = (keccak256(abi.encodePacked(guess)) == keccak256(abi.encodePacked(puzzListings[pId].answer)));

        Attempt memory newAttempt = Attempt({id: numAttempts, pId: pId, account: msg.sender, pass: pass});
        
        //maintain mapping
        puzzAttempts[pId].push(newAttempt);

        if(attemptCount[pId][msg.sender] == 0){ // 我有改
            puzzAtmptIdByUser[msg.sender].push(pId);

        }
        attemptCount[pId][msg.sender] += 1;

        if (pass) {
            uint256 totalPool = puzzListings[pId].prize;
            uint256 reward = (totalPool * (100 - burnRate)) / 100;
            uint256 burn = totalPool - reward;

            tokenManager.rewardUser(msg.sender, reward);
            tokenManager.burnToken(burn);

            puzzListings[pId].paidOut = true;
            // puzzShowStatus[pId] = false;
        }
    }

    //題目逾時無人解出，出題者可取回獎金中的90%
    function claimExpiredReward(uint256 pId) external nonReentrant onlyPuzCreater(pId) {
        PuzzStruct storage puzz = puzzListings[pId];
        require(!puzz.paidOut, "Already paid out");
        require(block.timestamp > puzz.timestamp_end, "Puzzle not expired yet");
        require(puzz.prize > 0, "No prize to claim");

        uint256 totalPool = puzz.prize;
        uint256 reward = (totalPool * (100 - burnRate)) / 100;
        uint256 burn = totalPool - reward;

        tokenManager.rewardUser(puzz.owner, reward);
        tokenManager.burnToken(burn);

        puzz.paidOut = true;
        puzzShowStatus[pId] = false;
    }
    // 某個題目被多少人答過
    function countTotalBids(uint256 puzId) public view returns (uint256) {
        return puzzAttempts[puzId].length;
    }

    // 顯示所有目前開放中的任務
    function getAllPuzzle() public view
        returns (PuzzStruct[] memory activePuzz, uint256[] memory relation)
    {
        uint256 total = _puzzCounter.current();
        uint256 count = 0;
        // 先算出有幾個符合條件的 puzzle
        for (uint256 i = 1; i <= total; i++) {
            if (puzzShowStatus[i] && puzzListings[i].listed) {
                count++;
            }
        }

        // 初始化回傳用的記憶體陣列
        activePuzz = new PuzzStruct[](count);
        relation  = new uint256[](count);

        uint256 idx = 0;
        // 填入符合條件的 puzzle 以及對應的關係
        for (uint256 i = 1; i <= total; i++) {
            if (puzzShowStatus[i] && puzzListings[i].listed) {
                activePuzz[idx]    = puzzListings[i];
                relation[idx]      = getMyRelationshipWithPuzzle(i);
                idx++;
            }
        }
        // 函式末尾會自動 return (activePuzz, relation)
    }


    function getMyRelationshipWithPuzzle(uint256 puzzId) public view returns (uint8) {
        PuzzStruct storage p = puzzListings[puzzId];

        // 0：自己是擁有者
        if (p.owner == msg.sender) {
            return 0;
        }

        bool userTried = false;
        bool userSolved = false;
        bool anySolved = false;

        // 掃描所有嘗試記錄
        Attempt[] storage attempts = puzzAttempts[puzzId];
        for (uint256 i = 0; i < attempts.length; i++) {
            Attempt storage a = attempts[i];
            if (a.pass) {
                anySolved = true;
            }
            if (a.account == msg.sender) {
                userTried = true;
                if (a.pass) {
                    userSolved = true;
                }
            }
        }

        if (userSolved) {
            // 1：使用者已經解開
            return 1;
        } else if (userTried) {
            if (anySolved) {
                // 3：使用者嘗試過但沒解開，有其他人解開
                return 3;
            } else {
                // 2：使用者嘗試過但沒解開，也沒人解開
                return 2;
            }
        } else {
            if (anySolved) {
                // 5：使用者沒嘗試過，但有人解開
                return 5;
            } else {
                // 4：使用者沒嘗試過，也沒人解開
                return 4;
            }
        }
    }

    // 回傳呼叫者（msg.sender）所有的 Attempt
    function getMyAttempted() public view returns (Attempt[] memory attempts) {
        uint256[] storage attemptedPuzzIds = puzzAtmptIdByUser[msg.sender];
        uint256 totalCount = 0;

        // 先統計使用者總共做過幾次嘗試（可能對同一個 puzzle 嘗試多次）
        for (uint256 i = 0; i < attemptedPuzzIds.length; i++) {
            uint256 pId = attemptedPuzzIds[i];
            Attempt[] storage atts = puzzAttempts[pId];
            for (uint256 j = 0; j < atts.length; j++) {
                if (atts[j].account == msg.sender) {
                    totalCount++;
                }
            }
        }

        // 建立回傳陣列
        attempts = new Attempt[](totalCount);
        uint256 index = 0;

        for (uint256 i = 0; i < attemptedPuzzIds.length; i++) {
            uint256 pId = attemptedPuzzIds[i];
            Attempt[] storage atts = puzzAttempts[pId];
            for (uint256 j = 0; j < atts.length; j++) {
                if (atts[j].account == msg.sender) {
                    attempts[index++] = atts[j];
                }
            }
        }
    }




    // 回傳呼叫者嘗試過的所有 Puzzle 資訊
    function getMyAttemptedPuzzle() public view returns (PuzzStruct[] memory puzzs) {
        uint256[] storage ids = puzzAtmptIdByUser[msg.sender];
        uint256 len = ids.length;
        puzzs = new PuzzStruct[](len);
        for (uint256 i = 0; i < len; i++) {
            puzzs[i] = puzzListings[ids[i]];
        }
    }

    // 回傳呼叫者所擁有的所有 Puzzle
    function getMyPuzzle() public view returns (PuzzStruct[] memory puzzs) {
        uint256 total = _puzzCounter.current();
        uint256 count = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (puzzListings[i].owner == msg.sender) {
                count++;
            }
        }
        puzzs = new PuzzStruct[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (puzzListings[i].owner == msg.sender) {
                puzzs[idx++] = puzzListings[i];
            }
        }
    }

    // 回傳指定 ID 的 Puzzle
    function getPuzzle(uint256 puzzId) public view returns (PuzzStruct memory puzz) {
        puzz = puzzListings[puzzId];
    }

}