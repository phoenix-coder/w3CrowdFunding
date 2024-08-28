// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply);
    }
}

contract CrowdFunding{
    address owner;
    uint rid =1;
    Token public crowdToken; 
    
    struct Request {
        uint id;
        bytes title;
        bytes description;
        uint deadline;
        uint target;
        uint raisedAmount;
        bool approved;
        address payable receiver;
    }

    mapping (uint => Request) public requests;
    event showOndashboard (uint id, bytes title, bytes description, uint deadline, uint target, uint raisedAmount, bool approved, address receiver);

    constructor(){
        owner = msg.sender;
    }

    function register (string memory _title, string memory _description, uint _deadline, uint _target) public {
        Request memory newRequest = Request({
            id: rid,
            title: bytes(_title),
            description : bytes(_description),
            deadline : block.timestamp + (_deadline * 60),
            target : _target,
            approved : false,
            receiver : payable (msg.sender),
            raisedAmount : 0
        });
        
        requests[rid] = newRequest;
        rid +=1;

    }

    function generateToken (string memory name, string memory symbol, uint256 totalSupply) public{
        require(msg.sender == owner,"Only owner");
        crowdToken = new Token(name, symbol, totalSupply);
    }

    function approveRequest(uint id) public {
        require(msg.sender == owner,"Only owner can approve request");
        Request memory myRequest = requests[id];

        require(block.timestamp < myRequest.deadline, "Deadline is over");
        require(requests[id].receiver != address(0), "Invalid receiver. Please add valid reciever");

        requests[id].approved = true;

        emit showOndashboard(myRequest.id, myRequest.title, myRequest.description, myRequest.deadline, myRequest.target, myRequest.raisedAmount, myRequest.approved, myRequest.receiver);
    }

    function donate(uint id) public payable returns (uint){
        
        require(requests[id].approved == true, "Invalid request Id");
        require(block.timestamp < requests[id].deadline, "Deadline is over");
        require(requests[id].receiver != address(0), "Invalid receiver. Please add valid reciever");
        require(requests[id].target > requests[id].raisedAmount, "Already satisfied");
        require(msg.value > 0, "Amount must be greater than 0");

        //uint val = msg.value*2/100;
        
        requests[id].raisedAmount += msg.value;
        requests[id].receiver.transfer(msg.value);

        uint256 tokenAmount = 2; 
        require(crowdToken.balanceOf(address(this)) >= tokenAmount, "Not enough tokens in contract");

        crowdToken.transfer(msg.sender, tokenAmount);
        return crowdToken.balanceOf(msg.sender);
    }

}