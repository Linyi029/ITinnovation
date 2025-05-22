// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract PUZchain is ReentrancyGuard, Ownable {
//     using Counters for Counters.Counter;

//     Counters.Counter private _puzzleCounter;
//     Counters.Counter private _solutionCounter;

//     struct PuzzleStruct {
//         uint id;
//         address creator;
//         string title;
//         string description;
//         uint reward;
//         bool solved;
//         uint timestamp;
//     }

//     struct SolutionStruct {
//         uint id;
//         uint puzzleId;
//         address solver;
//         string answer;
//         bool approved;
//         bool reviewed;
//         uint timestamp;
//     }

//     mapping(uint => PuzzleStruct) public puzzles;
//     mapping(uint => SolutionStruct[]) public puzzleSolutions;
//     mapping(address => uint[]) public userSolutions;

//     event PuzzleCreated(uint indexed id, address indexed creator);
//     event SolutionSubmitted(uint indexed id, uint puzzleId, address indexed solver);
//     event SolutionApproved(uint indexed id, uint puzzleId, address indexed solver);

//     function createPuzzle(
//         string memory title,
//         string memory description
//     ) public payable {
//         require(bytes(title).length > 0, "Title required");
//         require(msg.value > 0, "Reward must be > 0");

//         _puzzleCounter.increment();
//         uint puzzleId = _puzzleCounter.current();

//         puzzles[puzzleId] = PuzzleStruct({
//             id: puzzleId,
//             creator: msg.sender,
//             title: title,
//             description: description,
//             reward: msg.value,
//             solved: false,
//             timestamp: block.timestamp
//         });

//         emit PuzzleCreated(puzzleId, msg.sender);
//     }

//     function submitSolution(uint puzzleId, string memory answer) public {
//         require(puzzles[puzzleId].reward > 0, "Puzzle does not exist");
//         require(!puzzles[puzzleId].solved, "Already solved");

//         _solutionCounter.increment();
//         uint solutionId = _solutionCounter.current();

//         puzzleSolutions[puzzleId].push(SolutionStruct({
//             id: solutionId,
//             puzzleId: puzzleId,
//             solver: msg.sender,
//             answer: answer,
//             approved: false,
//             reviewed: false,
//             timestamp: block.timestamp
//         }));

//         userSolutions[msg.sender].push(solutionId);
//         emit SolutionSubmitted(solutionId, puzzleId, msg.sender);
//     }

//     function approveSolution(uint puzzleId, uint solutionIndex) public nonReentrant {
//         PuzzleStruct storage puzzle = puzzles[puzzleId];
//         require(puzzle.creator == msg.sender, "Only puzzle creator");
//         require(!puzzle.solved, "Puzzle already solved");
//         require(solutionIndex < puzzleSolutions[puzzleId].length, "Invalid solution");

//         SolutionStruct storage solution = puzzleSolutions[puzzleId][solutionIndex];
//         require(!solution.reviewed, "Solution already reviewed");

//         solution.approved = true;
//         solution.reviewed = true;
//         puzzle.solved = true;

//         // Transfer reward to solver
//         (bool success, ) = payable(solution.solver).call{value: puzzle.reward}("");
//         require(success, "Payment failed");

//         emit SolutionApproved(solution.id, puzzleId, solution.solver);
//     }

//     function rejectSolution(uint puzzleId, uint solutionIndex) public {
//         PuzzleStruct storage puzzle = puzzles[puzzleId];
//         require(puzzle.creator == msg.sender, "Only puzzle creator");
//         require(solutionIndex < puzzleSolutions[puzzleId].length, "Invalid solution");

//         SolutionStruct storage solution = puzzleSolutions[puzzleId][solutionIndex];
//         require(!solution.reviewed, "Already reviewed");

//         solution.reviewed = true;
//     }

//     // View functions
//     function getAllPuzzles() public view returns (PuzzleStruct[] memory) {
//         PuzzleStruct[] memory all = new PuzzleStruct[](_puzzleCounter.current());
//         for (uint i = 1; i <= _puzzleCounter.current(); i++) {
//             all[i - 1] = puzzles[i];
//         }
//         return all;
//     }

//     function getMyPuzzles() public view returns (PuzzleStruct[] memory) {
//         uint count;
//         for (uint i = 1; i <= _puzzleCounter.current(); i++) {
//             if (puzzles[i].creator == msg.sender) count++;
//         }

//         PuzzleStruct[] memory mine = new PuzzleStruct[](count);
//         uint idx = 0;
//         for (uint i = 1; i <= _puzzleCounter.current(); i++) {
//             if (puzzles[i].creator == msg.sender) {
//                 mine[idx++] = puzzles[i];
//             }
//         }
//         return mine;
//     }

//     function getSolutions(uint puzzleId) public view returns (SolutionStruct[] memory) {
//         return puzzleSolutions[puzzleId];
//     }

//     function getMySolutions() public view returns (SolutionStruct[] memory) {
//         uint count;
//         for (uint i = 1; i <= _puzzleCounter.current(); i++) {
//             for (uint j = 0; j < puzzleSolutions[i].length; j++) {
//                 if (puzzleSolutions[i][j].solver == msg.sender) count++;
//             }
//         }

//         SolutionStruct[] memory my = new SolutionStruct[](count);
//         uint idx = 0;
//         for (uint i = 1; i <= _puzzleCounter.current(); i++) {
//             for (uint j = 0; j < puzzleSolutions[i].length; j++) {
//                 if (puzzleSolutions[i][j].solver == msg.sender) {
//                     my[idx++] = puzzleSolutions[i][j];
//                 }
//             }
//         }

//         return my;
//     }
// }
