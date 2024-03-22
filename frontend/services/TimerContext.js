import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [remainingTime, setRemainingTime] = useState(0);

    return (
        <TimerContext.Provider value={{ remainingTime, setRemainingTime }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);