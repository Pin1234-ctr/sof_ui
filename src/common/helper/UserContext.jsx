import { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [childdetails, setChilddetails] = useState([]);
    const [childAdded, setChildAdded] = useState(0);
    const [chatMessages, setChatMessages] = useState([]);

    const addChatMessage = (message) => {
        setChatMessages((prev) => {
            const updatedMessages = [...prev, message];
            // Keep only the last 10 messages
            if (updatedMessages.length > 10) {
                return updatedMessages.slice(updatedMessages.length - 10);
            }
            return updatedMessages;
        });
    };

    const value = {
        childdetails, setChilddetails,
        childAdded, setChildAdded,
        chatMessages, setChatMessages, addChatMessage
    };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};