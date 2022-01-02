require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: process.env.ETH_ROPSTEN_URL,
      accounts: [process.env.ETH_PRIVATE_ACCOUNT_ADDRESS]
    }
  }
}