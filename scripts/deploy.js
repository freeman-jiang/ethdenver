const hre = require("hardhat");

/* 
host, address _receiver, address _token, int96 _flowRate, uint256 _amount
*/

const superfluidHost = "0xF2B4E81ba39F5215Db2e05B2F66f482BB8e87FD2";
const receiverAddress = "0xEa5cEBED0F460cB8234a044D48C38202680b6188";
const tokenAddress = "0x6fC99F5591b51583ba15A8C2572408257A1D2797";
const flowRate = 1160000;
const amount = 500000000;

async function main() {
  // We get the contract to deploy
  const Streamer = await hre.ethers.getContractFactory("Streamer");
  const streamerContract = await Streamer.deploy(
    superfluidHost,
    receiverAddress,
    tokenAddress
  );

  console.log("Streamer deployed to:", streamerContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
