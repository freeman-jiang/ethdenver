// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import { Controller } from './Controller.sol';

contract ControllerFactory {

    mapping(address => address) controllers;

    event newController(address controller, address owner);

    function deployController() public {

        require(controllers[msg.sender] == address(0x0), "You already own a controller");

        Controller controller = new Controller(msg.sender);

        controllers[msg.sender] == address(controller);

        emit newController(address(controller), msg.sender);
    }

}