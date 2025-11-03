import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";

export const DiscountContext = createContext();
export const DiscountProvider = ({ children }) => {
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:9999/discounts")
            .then((response) => setDiscounts(response.data))
            .catch((err) => console.log("Error fetching discounts", err));
    }, []);

    return (
        <DiscountContext.Provider
            value={{ discounts, setDiscounts, selectedDiscount, setSelectedDiscount }}
        >
            {children}
        </DiscountContext.Provider>
    );
};
