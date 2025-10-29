import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from 'axios';

export const ProductContext = createContext();
export const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        axios.get("http://localhost:9999/products")
            .then(response => setProducts(response.data))
            .catch((err) => console.log("Error fetching products", err));


        axios.get("http://localhost:9999/categories")
            .then(response => setCategories(response.data))
            .catch((err) => console.log("Error fetching categories", err));

    }, [])


    return (
        <ProductContext.Provider value={{ products, setProducts, selectedProduct, setSelectedProduct, categories, setCategories, selectedCategory, setSelectedCategory }}>
            {children}
        </ProductContext.Provider>
    );



}