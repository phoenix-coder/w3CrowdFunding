// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding{
    address public owner;
    uint public rid =1;
    struct Request {
        uint id;
        string title;
        string description;
        uint deadline;
        uint target;
        uint raisedAmount;
        bool approved;
        address payable receiver;
    }

   
    mapping (uint => Request) public requests;
    event showOndashboard (uint id, string title, string description, uint deadline, uint target, uint raisedAmount, bool approved, address receiver);

    constructor(){
        owner = msg.sender;
    }

    function register (string memory _title, string memory _description, uint _deadline, uint _target) public {
        Request memory newRequest = Request({
            id: rid,
            title: _title,
            description : _description,
            deadline : block.timestamp + (_deadline * 60),
            target : _target,
            approved : false,
            receiver : payable (msg.sender),
            raisedAmount : 0
        });
        
        requests[rid] = newRequest;
        rid +=1;

    }

    function approve(uint id) public {
        require(msg.sender == owner,"Only owner can approve request");
        Request memory myRequest = requests[id];

        require(block.timestamp < myRequest.deadline, "Deadline is over");
        require(requests[id].receiver != address(0), "Invalid receiver. Please add valid reciever");

        requests[id].approved = true;

        emit showOndashboard(myRequest.id, myRequest.title, myRequest.description, myRequest.deadline, myRequest.target, myRequest.raisedAmount, myRequest.approved, myRequest.receiver);
    }

    function donate(uint id) public payable {
        
        require(requests[id].approved == true, "Invalid request Id");
        require(block.timestamp < requests[id].deadline, "Deadline is over");
        require(requests[id].receiver != address(0), "Invalid receiver. Please add valid reciever");
        require(requests[id].target > requests[id].raisedAmount, "Already satisfied");
        require(msg.value > 0, "Amount must be greater than 0");

        requests[id].raisedAmount += msg.value;
        requests[id].receiver.transfer(msg.value);
    }

}