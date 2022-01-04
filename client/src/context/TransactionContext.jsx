import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const { ethereum } = window

const createEthereumContract = () => {
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
  const [transactions, setTransactions] = useState([])

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract()

        const availableTransactions = await transactionsContract.getAllTransactions()

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000,
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          }),
        )

        setTransactions(structuredTransactions)
      } else {
        console.log('Ethereum is not present')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    if (!ethereum) return alert('Please install Metamask!')

    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setCurrentAccount(accounts[0])
        getAllTransactions()
      } else console.log('No accounts found')
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

  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract()
        const currentTransactionCount = await transactionsContract.getTransactionCount()

        window.localStorage.setItem('transactionCount', currentTransactionCount)
      }
    } catch (error) {
      console.log(error)

      throw new Error('No ethereum object')
    }
  }

  const sendTransaction = async () => {
    if (!ethereum) return alert('Please install Metamask!')
    try {
      const { addressTo, amount, keyword, message } = formData
      const transactionContract = createEthereumContract()
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
    checkIfTransactionsExists()
  }, [transactionCount])

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
