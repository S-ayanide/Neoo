import React from 'react'

import logo from '../../images/logo.png'

const Footer = () => (
  <div className="w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-welcome">
    <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
      <div className="flex flex-[0.5] justify-center items-center">
        <img src={logo} alt="logo" className="w-32" />
      </div>
      <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
        <a
          target="_blank"
          href="https://coinmarketcap.com/"
          className="text-base text-center mx-2 cursor-pointer"
        >
          Market
        </a>
        <a
          target="_blank"
          href="https://crypto.com/exchange"
          className="text-base text-center mx-2 cursor-pointer"
        >
          Exchange
        </a>
        <a
          target="_blank"
          href="https://crypto-tutorials.io/"
          className="text-base text-center mx-2 cursor-pointer"
        >
          Tutorials
        </a>
        <a
          target="_blank"
          href="https://metamask.io/"
          className="text-base text-center mx-2 cursor-pointer"
        >
          Wallets
        </a>
      </div>
    </div>
    <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5 " />

    <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
      <p className="text-left text-xs">{`Neoo@${new Date().getFullYear()}`}</p>
      <a
        href="https://coindrop.to/sayanide"
        target="_blank"
        className="text-base text-neutral-500 text-xs"
      >
        Support my work ❤️
      </a>
      <p className="text-right text-xs">All rights reserved</p>
    </div>
  </div>
)

export default Footer
