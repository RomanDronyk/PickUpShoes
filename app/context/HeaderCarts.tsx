import React, { useState, useEffect, createContext, ReactNode } from "react";
import { useLocation } from "react-use";
import Cookies from "js-cookie";


export const HeaderBasketContext = createContext({});
interface HeaderContextProps {
    children: ReactNode;
}

export interface HeaderContextInterface {
    likedCart: any[];
    setLikedCart: React.Dispatch<React.SetStateAction<any[]>>;
    cartShow: boolean;
    count: number;
    removeLikeCart:any
    addLikedCart:any,
    cartShowMobile:any,
setCartShowMobile:any,

    setCartShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderContext = ({ children }: HeaderContextProps) => {
    const [cartShow, setCartShow] = useState(false);
    const [cartShowMobile, setCartShowMobile] = useState(false);

    const [likedCart, setLikedCart] = useState<any>(() => {
        const cartFromCookies = Cookies.get("likedCart");
        return cartFromCookies ? JSON.parse(cartFromCookies) : [];
    });
    const location = useLocation();
    const [count, setCount] = useState(0);
    const addLikedCart = (product:any)=>{
            setLikedCart((prev:any)=>{
                return [...prev,product]
            })
    }

      const removeLikeCart = (product:any)=>{
        setLikedCart((prev:any)=>{
            const productIndex = prev.findIndex((item:any) => item.id === product.id);
            if (productIndex > -1) {
                return prev.filter((_:any, index:any) => index !== productIndex);
              }
        })
      }

    useEffect(() => {
        Cookies.set("likedCart", JSON.stringify(likedCart), { expires: 7 });
        setCount(likedCart.length);
    }, [likedCart]);

    useEffect(() => {
        setCartShow(false);
    }, [location]);

    const headerBasketContext = {
        likedCart,
        setLikedCart,
        cartShow,
        count,
        removeLikeCart,
        addLikedCart,
        setCartShow,
        cartShowMobile,
setCartShowMobile,
    } as HeaderContextInterface;

    return (
        <HeaderBasketContext.Provider value={headerBasketContext}>
            {children}
        </HeaderBasketContext.Provider>
    );
}

export default HeaderContext;
