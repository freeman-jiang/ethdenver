// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import {
    CFAv1Library
} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import { 
    ISuperfluid,
    ISuperToken,
    ISuperApp,
    ISuperAgreement,
    ContextDefinitions,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";



contract Streamer {

    // Global Variables:
    int96 public flowRate; // Flow rate in wei per second
    ISuperToken public token; // Address of the ERC20-compliant token
    address public receiver;  // Address of the receiver
    bool public active;
    string public name;

    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    /** SUPERFLUID BOILERPLATE */
    using CFAv1Library for CFAv1Library.InitData;

    //initialize cfaV1 variable
    CFAv1Library.InitData public cfaV1;
    
    constructor(ISuperfluid host, address _receiver, address _token, address _owner, int96 _flowRate, string memory _name) {

        //initialize InitData struct, and set equal to cfaV1
        cfaV1 = CFAv1Library.InitData(
            host,
            //here, we are deriving the address of the CFA using the host contract
            IConstantFlowAgreementV1(
                address(host.getAgreementClass(
                        keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1")
                    ))
                )
        );

        receiver = _receiver;
        token = ISuperToken(_token);
        owner = _owner;
        flowRate = _flowRate;
        name = _name;
        active = false;
    }

    function editStream(address _receiver, int96 _flowRate) public onlyOwner {    
        receiver = _receiver;
        flowRate = _flowRate;
        cfaV1.updateFlow(receiver, token, flowRate);
    }


    function openStream() public onlyOwner {
        require(active == false, "a stream is already open");
        active = true;
        require(token.balanceOf(address(this)) >= uint96(flowRate), "Not enough balance deposited.");
        cfaV1.createFlow(receiver, token, flowRate);
    }

    function closeStream() public onlyOwner {
        require(active == true, "the stream is not open");
        cfaV1.deleteFlow(msg.sender, receiver, token);
        withdraw(token.balanceOf(address(this)));
        active = false;
    }

     function pauseStream() public onlyOwner {
        require(active == true);
        active = false;
        cfaV1.deleteFlow(msg.sender, receiver, token);
    }

    function getStreamerETA() external view returns(uint256) {
        return token.balanceOf(address(this)) / uint96(flowRate);
    }
    
    function deposit(uint256 _amount) public onlyOwner {

        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Token transfer failed.");
    }

    function withdraw(uint256 _amount) public {
        require(token.balanceOf(address(this)) >= _amount, "Insufficient funds.");
        bool success = token.transfer(msg.sender, _amount);
        require(success, "Token transfer failed.");
    }

    function getBalance() external view returns(uint256 balance) {
        return token.balanceOf(address(this));
    }

    function getStreamData() external view returns(int96 _flowRate, ISuperToken _token, address _receiver, bool _active, string memory _name, uint256 _balance, uint256 _eta) {
        return (flowRate, token, receiver, active, name, this.getBalance(), this.getStreamerETA());
    }

    function setName(string calldata _name) public {
        name = _name;
    }
}