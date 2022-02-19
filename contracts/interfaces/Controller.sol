// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import { Streamer } from './Streamer.sol';

import { ISuperfluid } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";  

import "@openzeppelin/contracts/access/Ownable.sol";

contract Controller is Ownable {

    Streamer[] streamers;

    event newStream(address streamAddress, address token, address receiver);

    function createNewStream(ISuperfluid host, address _receiver, address _token) public onlyOwner {
        
        Streamer streamer = new Streamer(host, _receiver, _token);
        
        streamers.push(streamer);

        emit newStream(address(streamer), _token, _receiver);

    }

}