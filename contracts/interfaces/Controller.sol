// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Controller {

    Stream[] listOfStreams;

    //create mapping with all the stream addresses

    struct Stream {
        address token;
        // address contract;
        // flow rate;
        // time;
    }

    // event newStream(address streamAddress, address streamToken );

    function createNewStream (address _token) public {
        Stream memory newStream;

        newStream.token = _token;

        listOfStreams.push(newStream);

        // add new stream address to mapping

        // emit newStream(_token)

    }

}