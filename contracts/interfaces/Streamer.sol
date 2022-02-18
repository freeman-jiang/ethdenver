// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import {
    CFAv1Library
} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

import "@openzeppelin/contracts/ownership/Ownable.sol";

interface Streamer is Ownable {

    // find out how to transfer super tokens
    function deposit() public payable onlyOwner;
        
    // safeTransferFrom to the caller's address
    function withdraw() public onlyOwner;

    function closeStream(address sender, address receiver, address token) public onlyOwner;
    
    function editStream(address receiver, address _token, int96 flowRate) public onlyOwner;

    function getStreamerETA() external view returns(uint256 eta);
}


contract Streamer is Ownable {

    int96 flowRate;

    address token;

    address receiver;

    using CFAv1Library for CFAv1Library.InitData;

    //initialize cfaV1 variable
    CFAv1Library.InitData public cfaV1;
    
    constructor(ISuperfluid host, address _receiver, address _token, int96 _flowRate) {
    
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

        deposit();

        receiver = _receiver;

        flowRate = _flowRate;

        token = _token;

        cfaV1.createFlow(_receiver, _token, _flowRate);
    }

    function withdraw () public {

    }

    function editStream (address _receiver, address _token, int96 _flowRate) public {

        receiver = _receiver;

        token = _token;

        flowRate = _flowRate;

        cfaV1.updateFlow(receiver, token, flowRate);
    }

    function closeStream () public onlyOwner {
        cfaV1.deleteFlow(msg.sender, receiver, token);
    }

    function getStreamerETA() external view returns(uint256 eta) {

        eta;
    }

}