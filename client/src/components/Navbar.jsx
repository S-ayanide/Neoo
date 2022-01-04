import React, { useState } from 'react'
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'

import logo from '../../images/logo.png'

const NavbarItem = ({ title, classProps, href }) => {
  return (
    <li className={`mx-4 cursor-pointer ${classProps}`}>
      <a target="_blank" href={href}>
        {title}
      </a>
    </li>
  )
}

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false)

  return (
    <nav className="w-full flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        <img src={logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className="text-dark md:flex hidden list-none flex-row justify-between items-center flex-initial">
        <NavbarItem
          key="Market0"
          title="Market"
          href="https://coinmarketcap.com/"
        />
        <NavbarItem
          key="Exchange1"
          title="Exchange"
          href="https://crypto.com/exchange"
        />
        <NavbarItem
          key="Tutorials2"
          title="Tutorials"
          href="https://crypto-tutorials.io/"
        />
        <NavbarItem
          key="Wallets3"
          title="Wallets"
          href="https://metamask.io/"
        />
      </ul>
      <div className="flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize="23"
            className="text-dark md:hidden cursor-pointer"
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <HiMenuAlt4
            fontSize="28"
            className="text-dark md:hidden cursor-pointer"
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <ul className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
            <li className="text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {['Market', 'Exchange', 'Tutorials', 'Wallets'].map((item, i) => (
              <NavbarItem
                key={item + i}
                title={item}
                classProps="my-2 text-lg"
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar
