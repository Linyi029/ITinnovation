// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/console.sol";
import "forge-std/Test.sol";
import "../src/CreatePuzz.sol";
import "../src/PUZToken.sol";
import "../src/TokenManager.sol";

contract CreatePuzzTest is Test {
    PUZToken token;
    TokenManager manager;
    CreatePuzz puzz;

    address owner;
    address user1;
    address user2;

    function setUp() public {
        owner = address(this);
        user1 = vm.addr(1);
        user2 = vm.addr(2);

        token = new PUZToken("PUZ", "PUZ", 1000 ether);
        manager = new TokenManager(address(token));
        puzz = new CreatePuzz(address(manager));

        token.transfer(user1, 100 ether);
        token.transfer(user2, 100 ether);

        vm.prank(user1);
        token.approve(address(manager), 100 ether);

        vm.prank(user2);
        token.approve(address(manager), 100 ether);

        vm.prank(user1);
        puzz.registerOrLogin();

        vm.prank(user2);
        puzz.registerOrLogin();
    }

   function testPrizePoolWithEntryFees() public {
    // user1 發布題目，固定費用為 2 ether
    vm.prank(user1);
    puzz.addPuzzListing("title", "desc", "tag", "42", 2 ether);

    uint managerBefore = token.balanceOf(address(manager));
    console.log("Prize after listing (should be 2 ether):", managerBefore);


    // user2 初始餘額
    uint user2Initial = token.balanceOf(user2);
    console.log("user2 initial balance:", user2Initial);

    // TokenManager 初始餘額（為了追蹤獎金池變化）
   
    uint supplyBefore = token.totalSupply();
    console.log("TotalSupplyInt:",supplyBefore);

    // user2 第一次解錯答案
    vm.prank(user2);
    puzz.attemptPuzzle(1, "24");
    console.log("user2 after first attempt:", token.balanceOf(user2));

    uint manager1 = token.balanceOf(address(manager));
    console.log("Prize  listing (should be 7 ether):", manager1);


    // user2 第二次解對答案
    vm.prank(user2);
    puzz.attemptPuzzle(1, "42");
    uint user2After = token.balanceOf(user2);
    console.log("user2 after second (win):", user2After);

    // 題目應該已經關閉
    bool show = puzz.puzzShowStatus(1);
    assertEq(show, false);

    // 驗證獎金池總額與期望
    uint expectedPool = 2 ether + 5 ether + 5.5 ether;
    uint expectedReward = (expectedPool * 90) / 100;
    console.log("Expected",expectedReward);
    console.log("Us2:",user2Initial - 10.5 ether + expectedReward);

    uint expectedBurn = expectedPool - expectedReward;
    console.log("expected burn:",expectedBurn);

    // 1. 使用者是否獲得正確獎勵
    assertApproxEqAbs(user2After, user2Initial - 10.5 ether + expectedReward, 0.01 ether);

    // 2. 總供應量是否減少（代表有成功 burn）
    uint supplyAfter = token.totalSupply();
    console.log("supplyAfter:",supplyAfter);

    uint actualBurn = supplyBefore - supplyAfter;

    console.log("actual burned:", actualBurn);
    assertApproxEqAbs(actualBurn, expectedBurn, 0.01 ether);

    uint prizepoolfinal = token.balanceOf(address(manager));

    console.log("prizepoolfinal ",prizepoolfinal);
}

function testPrizeReturnToCreatorAfterExpire() public {
    // user1 發布題目（不會有人解）
    vm.prank(user1);
    puzz.addPuzzListing("title", "desc", "tag", "42", 2 ether);

    uint supplyBefore = token.totalSupply();
    uint user1Initial = token.balanceOf(user1);

    // user2 嘗試一次，獎金池 +0.5 PUZ
    vm.prank(user2);
    puzz.attemptPuzzle(1, "wrong");

    // 快轉時間超過題目結束時間（30天）
    vm.warp(block.timestamp + 31 days);

    // user1 提領過期獎金
    vm.prank(user1);
    puzz.claimExpiredReward(1);

    // 驗證獎金回流與燒毀
    uint expectedPool = 2 ether + 5 ether;
    uint expectedReward = (expectedPool * 90) / 100;
    uint expectedBurn = expectedPool - expectedReward;

    uint user1After = token.balanceOf(user1);
    uint supplyAfter = token.totalSupply();
    uint actualBurn = supplyBefore - supplyAfter;

    console.log("expected reward to creator:", expectedReward);
    console.log("actual reward:", user1After - user1Initial);
    assertApproxEqAbs(user1After, user1Initial + expectedReward, 0.01 ether);
    assertApproxEqAbs(actualBurn, expectedBurn, 0.01 ether);

    // 驗證題目已關閉
    bool show = puzz.puzzShowStatus(1);
    assertEq(show, false);
    }



    
}