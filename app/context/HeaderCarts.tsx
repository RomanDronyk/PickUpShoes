import { useFetcher } from "@remix-run/react";
import React, { useState, useEffect, createContext, ReactNode } from "react";
import { useLocation } from "react-use";


export const HeaderBasketContext = createContext({});
interface HeaderContextProps {
    children: ReactNode;
}

export interface HeaderContextInterface {
    cartShow: boolean;
    count: number;
    likedCart: any,
    cartShowMobile: any,
    setCartShowMobile: any,
    removeLikedCartId: (id: string) => void,
    addLikedCartId: (id: string) => void,
    setCartShow: React.Dispatch<React.SetStateAction<boolean>>;
    likedCardId: string[],
    setLikedCardId: any,
    handleLikeToggle: (productId: string, actionType: 'add' | 'delete',) => void
}

const HeaderContext = ({ children }: HeaderContextProps) => {
    const [cartShow, setCartShow] = useState(false);
    const [cartShowMobile, setCartShowMobile] = useState(false);

    const fetcher = useFetcher()

    ////new
    const [likedCardId, setLikedCardId] = useState<string[]>([]);
    const [likedCart, setlikedCart] = useState([])
    const count = likedCardId.length;

    const handleLikeToggle = (productId: string, actionType: 'add' | 'delete') => {
        console.log(handleLikeToggle, "handleLikeToggle");

        // Оновлюємо локальний стан залежно від типу дії
        if (actionType === 'add') {
            addLikedCartId(productId);
        } else {
            removeLikedCartId(productId);
        }

        // Формуємо дані для запиту
        const formData = new FormData();
        formData.append("action", actionType);
        formData.append("id", productId);

        // Використовуємо fetcher для відправки запиту на сервер
        fetcher.submit(formData, { method: "post", action: "/liked" });

        // Обробка результату в залежності від fetcher.state
        if (fetcher.state === "idle") {
            console.log("Запит завершено, обробка відповідей");
        } else if (fetcher.state === "submitting") {
            console.log("Завантаження, запит виконується...");
        } else if (fetcher.state === "loading") {
            console.log("Чекаємо на відповідь від сервера...");
        }
    };


    // const handleLikeToggle = async (productId: string, actionType: 'add' | 'delete') => {
    //     console.log(handleLikeToggle, "handleLikeToggle")
    //     // Оновлюємо локальний стан залежно від типу дії
    //     if (actionType === 'add') {
    //         addLikedCartId(productId);
    //     } else {
    //         removeLikedCartId(productId);
    //     }

    //     const formData = new FormData();
    //     formData.append("action", actionType);
    //     formData.append("id", productId);


    //     // Відправляємо запит на сервер без await
    //     await fetch("/liked", {
    //         method: "POST",
    //         body: formData,
    //     }).then(response => {
    //         if (!response.ok) {
    //             // Обробка помилки, якщо запит не вдався
    //             console.error('Failed to update liked products on server');
    //             // Відкотити зміни в локальному стані у разі помилки
    //             if (actionType === 'add') {
    //                 removeLikedCartId(productId);
    //             } else {
    //                 addLikedCartId(productId);
    //             }
    //         } else {
    //             // Можливо, потрібно оновити UI залежно від нових даних
    //             return response;
    //         }
    //     }).then((data: any) => {
    //         if (data) {
    //             console.log(data.data);
    //         }
    //     }).catch(error => {
    //         // Обробка помилки мережі
    //         console.error('Network error:', error);
    //         if (actionType === 'add') {
    //             removeLikedCartId(productId);
    //         } else {
    //             addLikedCartId(productId);
    //         }
    //     });
    // };


    const addLikedCartId = (id: string) => {
        setLikedCardId((prev) => {
            return [...prev, id]
        })
    }
    const removeLikedCartId = (id: string) => {
        setLikedCardId((prev) => {
            return prev.filter(prevId => prevId !== id)
        })
    }

    ///end


    const location = useLocation();


    useEffect(() => {
        setCartShow(false);
    }, [location]);

    const headerBasketContext = {
        cartShow,
        count,
        setCartShow,
        cartShowMobile,
        setCartShowMobile,
        likedCardId,
        addLikedCartId,
        removeLikedCartId,
        likedCart,
        handleLikeToggle,
        setLikedCardId,
    } as HeaderContextInterface;

    return (
        <HeaderBasketContext.Provider value={headerBasketContext}>
            {children}
        </HeaderBasketContext.Provider>
    );
}

export default HeaderContext;
