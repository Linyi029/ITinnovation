// trigger recompilation
//SPDX-License-Identifier:MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DappWorks is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _jobCounter;

    struct JobStruct/* puzzle */ {
        uint id;
        address owner;
        address freelancer; // don't need
        string jobTitle;
        string description;
        string tags;
        uint prize; // 可能要是erc20的單位
        bool paidOut; //被解開與否，可改名為solved
        uint timestamp; //創建時間，可改名為timestamp_start
        bool listed; //還缺不缺人，缺就列出來，不要動，預設為true
        uint disputed; //被檢舉與否，可改成被檢舉幾次
        address[] bidders; //改成disputers
        // new features
        string answer;
        uint timestamp_end; // 創建者可自己訂，預設1個月
        uint timestamp_verified; // end + 7天

    }

    struct FreelancerStruct/* user */ {
        uint id;
        // uint jId;//don't need
        address account;
        // bool isAssigned; //don't need
        // new features
        // uint money //有多少代幣，可能要是erc20的單位
    }

    struct BidStruct/* attempt */ {
        uint id;
        uint jId;
        address account;
        // new features
        bool pass;
    }

    uint public platformCharge = 5;

    mapping(uint => JobStruct) jobListings; //puzzleListings(key=id)
    mapping(uint => FreelancerStruct[]) freelancers; //don't need
    mapping(uint => BidStruct[]) jobBidders; // 某個job被多個user bid

    mapping(uint => bool) jobListingExists; // job有沒有被刪除(刪除了還在鏈上，只是jobListingExist會是false)
    mapping(uint => mapping(address => bool)) public hasPlacedBid;

    mapping(address => uint[]) public jobsBidByUser; // 一個user bid過哪些job

    uint public nextUserId = 1;
    mapping(address => FreelancerStruct) public users;    // address → user
    mapping(address => bool)       public isRegistered; // quick check


    modifier onlyJobOwner(uint id) {
        require(jobListings[id].owner == msg.sender, "Unauthorized entity");
        _;
    }

    function registerOrLogin() public {
        // 如果已经注册，什么都不做（算登录）
        if (isRegistered[msg.sender]) {
            return;
        }
        // 否则就是注册新用户
        users[msg.sender] = FreelancerStruct({
            id      : nextUserId,
            account : msg.sender
        });
        isRegistered[msg.sender] = true;
        nextUserId++;
    }


    function addJobListing(
        string memory jobTitle,
        string memory description,
        string memory tags,
        // new features
        string memory answer
        // uint timestamp_end,
        // uint timestamp_verified
    ) public payable {
        require(bytes(jobTitle).length > 0, "Please provide a job title");
        require(bytes(description).length > 0, "Please provide a description");
        require(bytes(tags).length > 0, "Please provide tags");
        require(msg.value > 0 ether, "Insufficient funds");

        // Increment the counter before using the current value
        _jobCounter.increment();
        uint jobId = _jobCounter.current();

        JobStruct memory jobListing;

        jobListing.id = jobId;
        jobListing.owner = msg.sender;
        jobListing.jobTitle = jobTitle;
        jobListing.description = description;
        jobListing.tags = tags;
        jobListing.prize = msg.value;
        jobListing.listed = true;
        jobListing.timestamp = currentTime();
        // new features
        jobListing.answer = answer;
        jobListing.timestamp_end = currentTime() + 30 days;
        jobListing.timestamp_verified = currentTime() +7 days;

        jobListings[jobId] = jobListing;
        jobListingExists[jobId] = true;
    }

    function deleteJob(uint id) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].listed, "This job has been taken");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListingExists[id] = false;

        payTo(jobListings[id].owner, jobListings[id].prize);
    }

    function updateJob(
        uint id,
        string memory jobTitle,
        string memory description,
        string memory tags,
        string memory answer
    ) public {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].listed, "This job has been taken");
        require(!jobListings[id].paidOut, "This job has been paid out");

        jobListings[id].jobTitle = jobTitle;
        jobListings[id].description = description;
        jobListings[id].tags = tags;
        jobListings[id].answer = answer;
    }

    function bidForJob(uint id /* job id */ , string memory answer/* 新增輸入 */) public returns (bool pass){
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].owner != msg.sender, "Forbidden action!");
        require(!jobListings[id].paidOut, "This job has been paid out");
        require(jobListings[id].listed, "This job have been taken");
        // require(!hasPlacedBid[id][msg.sender], "You have placed a bid already"); // 必須刪掉這個限制

        BidStruct memory bid;
        bid.id = jobBidders[id].length + 1;
        bid.jId = id;
        bid.account = msg.sender;
        
        // 判斷答案對不對
        if (
            keccak256(bytes(jobListings[id].answer)) == 
            keccak256(bytes(answer))
        ){
            bid.pass = true;
        }else{
            bid.pass = false;
        }

        jobListings[id].bidders.push(msg.sender);
        jobBidders[id].push(bid); //新增bid對應到被投標的job

        // 只在第一次對某 jobId 投標時記錄進 jobsBidByUser
        if (!hasPlacedBid[id][msg.sender]) {
            hasPlacedBid[id][msg.sender] = true;
            jobsBidByUser[msg.sender].push(id);
        }
        return bid.pass;
    }

    // 不需要
    function acceptBid(
        uint id,
        uint jId,
        address bidder
    ) public onlyJobOwner(jId) {
        // require(jobListingExists[jId], "This job listing doesn't exist");
        // require(jobListings[jId].listed, "This job have been taken");
        // require(!jobListings[jId].paidOut, "This job has been paid out");
        // require(hasPlacedBid[jId][bidder], "UnIdentified bidder");

        // FreelancerStruct memory freelancer;

        // freelancer.id = freelancers[jId].length;
        // freelancer.jId = jId;
        // freelancer.account = bidder;
        // freelancer.isAssigned = true;

        // freelancers[jId].push(freelancer);
        // jobListings[jId].freelancer = bidder;

        // for (uint i = 0; i < jobBidders[jId].length; i++) {
        //     if (jobBidders[jId][i].id != id) {
        //         hasPlacedBid[jId][jobBidders[jId][i].account] = false;
        //     }
        // }

        // jobListings[jId].listed = false;
    }

    function bidStatus(uint id) public view returns (bool) {
        return hasPlacedBid[id][msg.sender];
    }

    // 新增一個 view 函式
    function bidPassStatus(uint id, address user) public view returns (bool hasUserPassed, bool hasAnyonePassed) {
        BidStruct[] memory bids = jobBidders[id];
        bool userPassed = false;
        bool someonePassed = false;

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].pass) {
                someonePassed = true;
            }
            if (bids[i].account == user && bids[i].pass) {
                userPassed = true;
            }
        }

        return (userPassed, someonePassed);
    }


    function dispute(uint id) public { /** onlyJobOwner (id)  權限拿掉 */
        require(jobListingExists[id], "This job listing doesn't exist");
        // require(!jobListings[id].disputed, "This job already disputed"); // 必須刪掉這個限制
        require(block.timestamp > jobListings[id].timestamp_end, "Answer time not ended");
        require(block.timestamp < jobListings[id].timestamp_verified, "Review time ended");

        //花錢擔保這題有問題

        jobListings[id].disputed += 1; // 變成增加次數
    }

    function revoke(uint jId, uint id) public /** onlyOwner  把權限限制拿掉，變成一個在job(puzzle)審核期間要結束的那一刻執行的func，將出題者獎金沒收 */ {
        require(jobListingExists[jId], "This job listing doesn't exist");
        require(jobListings[jId].disputed > 0, "This job must be on dispute"); // 要被檢舉至少一次
        require(!jobListings[jId].paidOut, "This job has been paid out"); // 必須在審核期間(若審核期間過了有超過檢舉次數門檻與不理會，因為理論上之前處理過)

        // 處理錢錢(如果人數過門檻，dispute的人拿到錢錢；沒有過，錢錢給出題者)

        // 不需要
        // Use two separate indexes to access the FreelancerStruct
        // FreelancerStruct storage freelancer = freelancers[jId][id];

        // freelancer.isAssigned = false;
        // jobListings[jId].freelancer = address(0);
        // payTo(jobListings[jId].owner, jobListings[jId].prize);

        // jobListings[jId].listed = true;
    }

    function resolved(uint id, uint jId  ) public   { //* 新增 jId*// //** onlyOwner 任何人 *//
        require(jobListingExists[id], "This job listing doesn't exist");
        require(jobListings[id].disputed > 0, "This job must be on dispute"); // 此人要dispute過這個job，還沒改好
        require(!jobListings[id].paidOut, "This job has been paid out"); // job要在審查期間，還沒改好

        jobListings[id].disputed = 0; //可能要改
        // 退擔保金

    }

    function payout(uint id) public nonReentrant onlyJobOwner(id) {
        require(jobListingExists[id], "This job listing doesn't exist");
        require(!jobListings[id].listed, "This job has not been taken");
        require(jobListings[id].disputed <= 0, "This job must not be on dispute");
        require(!jobListings[id].paidOut, "This job has been paid out");

        uint reward = jobListings[id].prize;
        uint tax = (reward * platformCharge) / 100;

        // 處理錢錢(答成功)
        payTo(jobListings[id].freelancer, reward - tax);
        payTo(owner(), tax);
        jobListings[id].paidOut = true;
        // timestamp_end 設為現在，timestamp_verified 隨之改變
    }

    // 取這個題目被答過的每一次紀錄
    function getBidders(
        uint id
    ) public view returns (BidStruct[] memory Bidders) {
        if (jobListings[id].listed && jobListingExists[id] ) {
            Bidders = jobBidders[id];
        } else {
            Bidders = new BidStruct[](0);
        }
    }

    // 取這個題目被誰答過(don't need ?)
    function getFreelancers(
        uint id
    ) public view returns (FreelancerStruct[] memory) {
        return freelancers[id];
    }

    // 某個題目被多少人答過
    function countTotalBids(uint jobId) public view returns (uint) {
        return jobBidders[jobId].length;
    }

    // don't need
    function getAcceptedFreelancer(
        uint id
    ) public view returns (FreelancerStruct memory) {
        // require(jobListingExists[id], "This job listing doesn't exist");

        // for (uint i = 0; i < freelancers[id].length; i++) {
        //     if (freelancers[id][i].isAssigned) {
        //         return freelancers[id][i];
        //     }
        // }

        // // If no freelancer is assigned, return an empty struct or handle it as needed.
        // FreelancerStruct memory emptyFreelancer;
        // return emptyFreelancer;
    }

    // 顯示所有目前開放中的任務
    function getJobs() public view returns (JobStruct[] memory ActiveJobs) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                jobListings[i].listed &&
                !jobListings[i].paidOut
            ) {
                available++;
            }
        }

        ActiveJobs = new JobStruct[](available);

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                jobListings[i].listed &&
                !jobListings[i].paidOut
            ) {
                ActiveJobs[currentIndex++] = jobListings[i];
            }
        }
    }

    // 我出過那些題
    function getMyJobs() public view returns (JobStruct[] memory MyJobs) {
        uint available;
        uint currentIndex = 0;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].owner == msg.sender) {
                available++;
            }
        }

        MyJobs = new JobStruct[](available);

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (jobListingExists[i] && jobListings[i].owner == msg.sender) {
                MyJobs[currentIndex++] = jobListings[i];
            }
        }
    }

    // 查詢某個特定 Job（題目）的完整資訊
    function getJob(uint id) public view returns (JobStruct memory) {
        return jobListings[id];
    }

    // 獲取自己所有「進行中」的任務(don't need)
    function getAssignedJobs()
        public
        view
        returns (JobStruct[] memory AssignedJobs)
    {
        uint available;

        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                !jobListings[i].paidOut &&
                jobListings[i].freelancer == msg.sender
            ) {
                available++;
            }
        }

        AssignedJobs = new JobStruct[](available);

        uint currentIndex = 0;
        for (uint256 i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i] &&
                !jobListings[i].paidOut &&
                jobListings[i].freelancer == msg.sender
            ) {
                AssignedJobs[currentIndex++] = jobListings[i];
            }
        }

        return AssignedJobs;
    }

    // 我嘗試解過哪些 puzzle，回傳bid
    function getBidsForBidder() public view returns (BidStruct[] memory Bids) {
        // Create a dynamic array to store the bids
        BidStruct[] memory allBids = new BidStruct[](_jobCounter.current());
        uint currentIndex = 0;

        for (uint i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i]
                // jobListings[i].listed &&
                // !jobListings[i].paidOut
            ) {
                if (hasPlacedBid[i][msg.sender]) {
                    // Iterate over the bids for the current job and add matching bids to the array
                    for (uint j = 0; j < jobBidders[i].length; j++) {
                        if (jobBidders[i][j].account == msg.sender) {
                            allBids[currentIndex] = jobBidders[i][j];
                            currentIndex++;
                        }
                    }
                }
            }
        }

        // Create a new array with only the relevant bids
        Bids = new BidStruct[](currentIndex);
        for (uint k = 0; k < currentIndex; k++) {
            Bids[k] = allBids[k];
        }

        return Bids;
    }

    // // 我嘗試解過哪些 puzzle，回傳job
    function getJobsForBidder()
        public
        view
        returns (JobStruct[] memory bidderJobs)
    {
        // Create a dynamic array to store the jobs
        JobStruct[] memory matchingJobs = new JobStruct[](
            _jobCounter.current()
        );
        uint currentIndex = 0;

        for (uint i = 1; i <= _jobCounter.current(); i++) {
            if (
                jobListingExists[i]
                // jobListings[i].listed &&
                // !jobListings[i].paidOut
            ) {
                if (hasPlacedBid[i][msg.sender]) {
                    matchingJobs[currentIndex] = jobListings[i];
                    currentIndex++;
                }
            }
        }

        // Create a new array with only the relevant jobs
        bidderJobs = new JobStruct[](currentIndex);
        for (uint k = 0; k < currentIndex; k++) {
            bidderJobs[k] = matchingJobs[k];
        }

        return bidderJobs;
    }

    // private function

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

    function payTo(address to, uint256 amount) internal {
        // 處理付錢邏輯，有需要請改
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}
