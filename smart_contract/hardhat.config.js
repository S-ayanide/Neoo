require('@nomiclabs/hardhat-waffle');
try { require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); } catch (_) {}

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: process.env.ETH_SEPOLIA_URL || '',
      accounts: process.env.ETH_PRIVATE_ACCOUNT_ADDRESS
        ? [process.env.ETH_PRIVATE_ACCOUNT_ADDRESS]
        : [],
    }
  }
}