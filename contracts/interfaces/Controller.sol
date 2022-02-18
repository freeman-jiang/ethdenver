// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import { Streamer } from './Streamer.sol';

contract Controller {

    address[] streamers;

    event newStream(address streamAddress, address token, address receiver, int96 flowRate);

    function createNewStream (address _receiver, address _token, int96 flowRate) public {
        
        address streamer = new Streamer(host, _receiver, _token, _flowRate);
        
        streamers.push(streamer);

        emit newStream(streamer, _token, receiver, flowRate);

    }

}