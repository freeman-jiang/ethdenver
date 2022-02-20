// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import { Controller } from './Controller.sol';

contract ControllerFactory {

    
    mapping(address => address) controllers;

    event newController(address indexed owner, address controller);

    function deployController() public {

        require(controllers[msg.sender] == address(0x0), "You already own a controller");

        Controller controller = new Controller(msg.sender);

        controllers[msg.sender] = address(controller);

        emit newController(msg.sender, address(controller));
    }

    function getController() external view returns(address controller) {
        return controllers[msg.sender];
    }

    function deactivateController() public {
        require(controllers[msg.sender] != address(0x0), "You don't own a controller");
        controllers[msg.sender] = address(0x0);
    }
}