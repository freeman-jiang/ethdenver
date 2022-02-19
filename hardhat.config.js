require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.0",
  paths: {
    artifacts: "./src/artifacts",
  },
  defaultNetwork: "matic",
  networks: {
    hardhat: {},
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`0x${process.env.ACCOUNT_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    ropsten: {
      url: process.env.ROPSTEN_RPC,
      accounts: [`0x${process.env.ACCOUNT_KEY}`],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "your key here"
  }
};
