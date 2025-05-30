// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {PUZToken} from "../src/PUZToken.sol";
import {TokenManager} from "../src/TokenManager.sol";
import {TokenManagerFactory} from "../src/TokenManagerFac.sol";
import {CreatePuzz} from "../src/CreatePuzz.sol";

//連前端測試可以參考這個去做
contract CreatePuzzTest is Test {
    PUZToken public token;
    TokenManagerFactory public factory;
    CreatePuzz public puzz;

    address public user1;
    address public user2;

    function setUp() public {
        token = new PUZToken("PUZ", "PUZ", 1000 ether);

        puzz = new CreatePuzz(address(token), address(factory));
        factory = new TokenManagerFactory(address(token), address(puzz));
        puzz.setFactory(address(factory)); // 最後把 factory 設給 puzz

        user1 = vm.addr(1);
        user2 = vm.addr(2);

        token.transfer(user1, 100 ether);
        token.transfer(user2, 100 ether);

        vm.prank(user1);
        token.approve(address(puzz), type(uint256).max);
        vm.prank(user2);
        token.approve(address(puzz), type(uint256).max);

        vm.prank(user1);
        puzz.registerOrLogin();
        vm.prank(user2);
        puzz.registerOrLogin();
    }

    function testPuzzleFlowCorrectAnswer() public {
        vm.prank(user1);
        //user1出題，扣兩塊
        uint256 puzId = puzz.createAndAddWithNewManager("title", "desc", "tag", "42", 2 ether);
        console.log("Puzzle ID:", puzId);

        vm.prank(user2);
        puzz.attemptPuzzle(puzId, "24"); //user2答錯，扣入場費5塊

        vm.prank(user2);
        puzz.attemptPuzzle(puzId, "42"); //user2答對，先扣掉5.5塊，發還(2+5+5.5)*0.9

        uint256 balance1 = token.balanceOf(user1);
        uint256 balance2 = token.balanceOf(user2);
        uint256 contractBal = token.balanceOf(address(puzz));

        console.log("user1 balance:", balance1);
        console.log("user2 balance:", balance2);
        console.log("CreatePuzz contract balance:", contractBal);

        //拿來看console確定有沒有算錯的，沒有意義
        assertEq(puzz.puzzShowStatus(puzId), false);
    }

    function testPuzzleClaimAfterTimeout() public {
        vm.prank(user1);
        //user1出題，扣兩塊
        uint256 puzId = puzz.createAndAddWithNewManager("title", "desc", "tag", "42", 2 ether);
        console.log("Puzzle ID:", puzId);

        //user2期限內答題但答錯，扣五塊給獎金池
        vm.prank(user2);
        puzz.attemptPuzzle(puzId, "wrong");

        //用來測試的時間快轉
        vm.warp(block.timestamp + 31 days);

        //逾期無人答對，獎金90%發還出題者
        uint256 before = token.balanceOf(user1);
        vm.prank(user1);
        puzz.claimExpiredReward(puzId);
        uint256 afterClaim = token.balanceOf(user1);

        console.log("user1 got back reward:", afterClaim - before);
        console.log("user1 balance:", afterClaim);
        console.log("user2 balance:", token.balanceOf(user2));

        //拿來看console確定有沒有算錯的，沒有意義
        assertEq(puzz.puzzShowStatus(puzId), false);
    }

    function testPrizePoolAndBurnLogic() public {
        vm.prank(user1);
        uint256 puzId = puzz.createAndAddWithNewManager("title", "desc", "tag", "42", 2 ether);
        console.log("Puzzle ID:", puzId);

        uint256 supplyBefore = token.totalSupply();

        vm.prank(user2);
        puzz.attemptPuzzle(puzId, "wrong");
        vm.prank(user2);
        puzz.attemptPuzzle(puzId, "42");

        uint256 supplyAfter = token.totalSupply();
        uint256 burnAmount = supplyBefore - supplyAfter;

        console.log("Total burn:", burnAmount);
        console.log("user1 balance:", token.balanceOf(user1));
        console.log("user2 balance:", token.balanceOf(user2));

        //拿來看console確定有沒有算錯的，沒有意義
        assertGt(burnAmount, 0);
    }

    function testMultiplePuzzleIds() public {
        vm.prank(user1);
        uint256 id1 = puzz.createAndAddWithNewManager("title1", "desc", "tag", "42", 2 ether);
        vm.prank(user1);
        uint256 id2 = puzz.createAndAddWithNewManager("title2", "desc", "tag", "84", 3 ether);

        console.log("Puzzle ID 1:", id1); // 應該是 1
        console.log("Puzzle ID 2:", id2); // 應該是 2

        //拿來看console確定有沒有算錯的，沒有意義
        assertEq(false, false);
    }
}
