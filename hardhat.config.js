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
  // defaultNetwork: "matic",
  networks: {
    hardhat: {},
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`0x${process.env.ACCOUNT_KEY}`],
    },
    ropsten: {
      url: process.env.ROPSTEN_RPC,
      accounts: [`0x${process.env.ACCOUNT_KEY}`],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
