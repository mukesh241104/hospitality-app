import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // Global States
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [compareList, setCompareList] = useState(() => {
        const saved = localStorage.getItem('compareList');
        return saved ? JSON.parse(saved) : [];
    });

    // Save compare list to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (hotel) => {
        setCompareList((prev) => {
            // Prevent duplicates
            if (prev.find((h) => h.code === hotel.code)) return prev;
            // Max 4 hotels to compare
            if (prev.length >= 4) {
                return prev;
            }
            return [...prev, hotel];
        });
    };

    const removeFromCompare = (hotelCode) => {
        setCompareList((prev) => prev.filter((h) => h.code !== hotelCode));
    };

    const clearCompareList = () => {
        setCompareList([]);
    };

    return (
        <AppContext.Provider
            value={{
                hotels,
                setHotels,
                loading,
                setLoading,
                compareList,
                addToCompare,
                removeFromCompare,
                clearCompareList,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
