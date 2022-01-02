import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const { ethereum } = window

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )

  return transactionContract
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount'),
  )

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert('Please install Metamask!')

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) setCurrentAccount(accounts[0])
      else console.log('No accounts found')
    } catch (error) {
      console.log(error)

      throw new Error('No Ethereum Object')
    }
  }

  const connectWallet = async () => {
    if (!ethereum) return alert('Please install Metamask!')

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (err) {
      console.log(err)

      throw new Error('No Ethereum Object')
    }
  }

  const sendTransaction = async () => {
    if (!ethereum) return alert('Please install Metamask!')
    try {
      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // 21000 Gwei
            value: parsedAmount._hex, // Parsed ETH Amount
          },
        ],
      })

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      )
      setIsLoading(true)
      console.log(`Loading - ${transactionHash.hash}`)
      await transactionHash.wait()
      console.log(`Success - ${transactionHash.hash}`)
      setIsLoading(false)

      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
    } catch (err) {
      console.log(err)

      throw new Error('No Ethereum Object')
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
