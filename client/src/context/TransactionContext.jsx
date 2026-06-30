import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const getEthereum = () => window.ethereum

const createEthereumContract = (useSigner = true) => {
  const provider = new ethers.providers.Web3Provider(getEthereum())
  const signerOrProvider = useSigner ? provider.getSigner() : provider
  return new ethers.Contract(contractAddress, contractABI, signerOrProvider)
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
  const [isConnecting, setIsConnecting] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount'),
  )
  const [transactions, setTransactions] = useState([])

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  const getAllTransactions = async () => {
    try {
      if (getEthereum()) {
        const transactionsContract = createEthereumContract(false)

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
    if (!getEthereum()) return alert('Please install Metamask!')

    try {
      const accounts = await getEthereum().request({ method: 'eth_accounts' })
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
    if (!getEthereum()) return alert('Please install Metamask!')
    if (isConnecting) return

    setIsConnecting(true)
    try {
      const accounts = await getEthereum().request({ method: 'eth_requestAccounts' })
      setCurrentAccount(accounts[0])
    } catch (err) {
      if (err.code === -32002) {
        console.warn('MetaMask approval is already pending. Please open MetaMask to approve or reject the request.')
      } else {
        console.log(err)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const checkIfTransactionsExists = async () => {
    try {
      if (getEthereum()) {
        const transactionsContract = createEthereumContract(false)
        const currentTransactionCount = await transactionsContract.getTransactionCount()

        window.localStorage.setItem('transactionCount', currentTransactionCount)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const sendTransaction = async () => {
    if (!getEthereum()) return alert('Please install Metamask!')
    if (!currentAccount) return alert('Please connect your wallet first.')

    try {
      const { addressTo, amount, keyword, message } = formData
      const transactionContract = createEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await getEthereum().request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: '0x5208', // 21000 Gwei
            value: parsedAmount._hex,
          },
        ],
      })

      setIsLoading(true)
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword,
      )
      console.log(`Loading - ${transactionHash.hash}`)
      await transactionHash.wait()
      console.log(`Success - ${transactionHash.hash}`)
      setIsLoading(false)

      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
    } catch (err) {
      setIsLoading(false)
      console.log(err)
      alert(`Transaction failed: ${err?.message || err}`)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    checkIfTransactionsExists()
  }, [])

  useEffect(() => {
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
        isConnecting,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
