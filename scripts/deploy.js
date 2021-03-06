const hre = require("hardhat");

/* 
host, address _receiver, address _token, int96 _flowRate, uint256 _amount
*/

const superfluidHost = "0xF2B4E81ba39F5215Db2e05B2F66f482BB8e87FD2"; // Superfluid Ropsten
const receiverAddress = "0xEa5cEBED0F460cB8234a044D48C38202680b6188"; // Jason Yuan
const tokenAddress = "0x6fC99F5591b51583ba15A8C2572408257A1D2797"; // ETHx
const flowRate = 1160000;
const amount = 500000000;

async function main() {
  // We get the contract to deploy
  const ControllerFactory = await hre.ethers.getContractFactory(
    "ControllerFactory"
  );
  const controllerFactoryContract = await ControllerFactory.deploy();

  console.log("Factory deployed to:", controllerFactoryContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
