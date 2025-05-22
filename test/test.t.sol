// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "forge-std/Test.sol";
// import "../src/DappWorks.sol";

// contract DappWorksTest is Test {
// DappWorks dw;
// address deployer;
// address client1;
// address client2;
// address freelancer1;
// address freelancer2;

// function setUp() public {
//     deployer = address(this);
//     client1 = address(0x1);
//     client2 = address(0x2);
//     freelancer1 = address(0x3);
//     freelancer2 = address(0x4);
//     vm.deal(client1, 1 ether);
//     vm.deal(client2, 1 ether);
//     vm.deal(freelancer1, 1 ether);
//     vm.deal(freelancer2, 1 ether);
//     dw = new DappWorks();
// }

// function testJobCreationAndFetch() public {
//     vm.prank(client1);
//     dw.addJobListing("Content creator", "Desc...", "Tag1,Tag2", { value: 0.3 ether });

//     DappWorks.JobStruct[] memory jobs = dw.getJobs();
//     assertEq(jobs.length, 1);

//     DappWorks.JobStruct memory job = dw.getJob(1);
//     assertEq(job.id, 1);
//     assertEq(job.tags, "Tag1,Tag2");
// }

// function testUpdateAndDelete() public {
//     vm.prank(client1);
//     dw.addJobListing("Title", "Desc", "A,B,C", { value: 0.3 ether });

//     // update
//     vm.prank(client1);
//     dw.updateJob(1, "Title", "Desc", "X,Y,Z");
//     DappWorks.JobStruct memory updated = dw.getJob(1);
//     assertEq(updated.tags, "X,Y,Z");

//     // delete
//     vm.prank(client1);
//     dw.deleteJob(1);
//     DappWorks.JobStruct[] memory afterDel = dw.getJobs();
//     assertEq(afterDel.length, 0);
// }

// function testBiddingAndAssignment() public {
//     vm.prank(client1);
//     dw.addJobListing("Job", "Desc", "T1,T2", { value: 0.3 ether });

//     // bid
//     vm.prank(freelancer1);
//     dw.bidForJob(1);
//     DappWorks.BidStruct[] memory bids = dw.getBidders(1);
//     assertEq(bids.length, 1);
//     assertEq(bids[0].account, freelancer1);

//     // accept
//     vm.prank(client1);
//     dw.acceptBid(1, 1, freelancer1);
//     DappWorks.FreelancerStruct[] memory fls = dw.getFreelancers(1);
//     assertEq(fls.length, 1);
//     assertEq(fls[0].account, freelancer1);

//     DappWorks.JobStruct[] memory asg = dw.getAssignedJobs();
//     assertEq(asg.length, 1);
// }

// function testDisputeRevokeResolve() public {
//     vm.prank(client1);
//     dw.addJobListing("J","D","T",{ value: 0.3 ether });
//     vm.prank(freelancer1);
//     dw.bidForJob(1);
//     vm.prank(client1);
//     dw.acceptBid(1, 1, freelancer1);

//     // dispute
//     vm.prank(client1);
//     dw.dispute(1);
//     (, , , , , , , , bool disputed, ) = dw.getJob(1);
//     assertTrue(disputed);

//     // revoke
//     vm.prank(deployer);
//     dw.revoke(1, 0);
//     (, , , , , , , , bool listed, ) = dw.getJob(1);
//     assertTrue(listed);

//     // resolve
//     vm.prank(deployer);
//     dw.resolved(1);
//     (, , , , , , , , disputed, ) = dw.getJob(1);
//     assertFalse(disputed);
// }

// function testPayout() public {
//     vm.prank(client1);
//     dw.addJobListing("Job","Desc","T",{ value: 0.3 ether });
//     vm.prank(freelancer1);
//     dw.bidForJob(1);
//     vm.prank(client1);
//     dw.acceptBid(1, 1, freelancer1);

//     vm.prank(client1);
//     dw.payout(1);
//     (, , , address fl, , , , , , bool paidOut) = dw.getJob(1);
//     assertTrue(paidOut);
// }

// }