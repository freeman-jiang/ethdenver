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

// interface IStreamer is Ownable {
//     function deposit() public payable;        
//     function withdraw() public;
//     function closeStream(address sender, address receiver, address token) public;
//     function editStream(address receiver, address _token, int96 flowRate) public;
//     function getStreamerETA() external view returns(uint256);
// }


contract Streamer {

    // Global Variables:
    int96 flowRate; // Flow rate in wei per second
    ISuperToken token; // Address of the ERC20-compliant token
    address receiver;  // Address of the receiver
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    /** SUPERFLUID BOILERPLATE */
    using CFAv1Library for CFAv1Library.InitData;

    //initialize cfaV1 variable
    CFAv1Library.InitData public cfaV1;
    
    constructor(ISuperfluid host, address _receiver, address _token) {

        owner = msg.sender;
    
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

    }

    function editStream (address _receiver, address _token, int96 _flowRate) public onlyOwner {
        withdraw(token.balanceOf(address(this)));

        receiver = _receiver;
        token = ISuperToken(_token);
        flowRate = _flowRate;
        cfaV1.updateFlow(receiver, token, flowRate);
    }

    function closeStream() public onlyOwner {
        cfaV1.deleteFlow(msg.sender, receiver, token);
        withdraw(token.balanceOf(address(this)));
    }

    function getStreamerETA() external view returns(uint256) {
        return token.balanceOf(address(this)) / uint96(flowRate);
    }
    
    function deposit(uint256 _amount, int96 _flowRate) public onlyOwner {
        token.approve(address(this), _amount);
        bool success = token.transferFrom(msg.sender, address(this), _amount);
        require(success, "Token transfer failed.");
        flowRate = _flowRate;
        cfaV1.createFlow(receiver, token, flowRate);
    }

    function withdraw(uint256 _amount) public {
        require(token.balanceOf(address(this)) >= _amount, "Insufficient funds.");
        bool success = token.transfer(msg.sender, _amount);
        require(success, "Token transfer failed.");
    }

    function getBalance() external view returns(uint256 balance) {
        return token.balanceOf(address(this));
    }

    function readAllowance (address account) external view returns(uint256 allowance) {
        return token.allowance(account, address(this));
    }

    function getConfig() external view returns(int96 _flowRate, ISuperToken _token, address _receiver, uint256 allowance) {
        return (flowRate, token, receiver, token.allowance(msg.sender, address(this)));
    }

}