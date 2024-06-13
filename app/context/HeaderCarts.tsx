import React, { useState, useEffect, createContext, ReactNode } from "react"

export const HeaderBasketContext = createContext({})
interface HeaderContextProps {
    children: ReactNode;
  }
export interface HeaderContextInterface {
    cartShow: boolean
    setCartShow: React.Dispatch<React.SetStateAction<boolean>>
}

const HeaderContext = ({ children }:HeaderContextProps) => {
    const [cartShow, setCartShow] = useState(false);

    const headerBasketContext = {
        cartShow, 
        setCartShow
    }as HeaderContextInterface
    return <>
        <HeaderBasketContext.Provider value={headerBasketContext}>
            {children}
        </HeaderBasketContext.Provider>
    </>
}
export default HeaderContext;