import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();
const API_URL = "http://localhost:9999";

const initialState = {
  cart: null,
  cartDetails: [],
};

// --- Reducer ---
function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_CART_DETAILS":
      return { ...state, cartDetails: action.payload };
    case "CLEAR_CART":
      return { ...state, cartDetails: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const user = JSON.parse(localStorage.getItem("user"));

  // --- Load cart & cartDetails (chỉ chạy 1 lần khi mount) ---
  useEffect(() => {
    if (!user?.id) return;

    const loadCart = async () => {
      try {
        // Lấy cart của user
        const { data: carts } = await axios.get(`${API_URL}/carts`, {
          params: { customerId: user.id },
        });

        let cart;
        if (carts.length > 0) {
          cart = carts[0];
        } else {
          const { data } = await axios.post(`${API_URL}/carts`, {
            customerId: user.id,
            totalAmount: 0,
          });
          cart = data;
        }

        dispatch({ type: "SET_CART", payload: cart });

        // Lấy cartDetails
        const { data: details } = await axios.get(`${API_URL}/cartDetails`, {
          params: { cartId: cart.id },
        });
        dispatch({ type: "SET_CART_DETAILS", payload: details });
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      }
    };

    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // chỉ chạy 1 lần

  // --- Tính tổng tiền ---
  const getTotalAmount = () =>
    state.cartDetails.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    );

  // --- Cập nhật tổng tiền lên API ---
  const updateTotalAmount = async (cartDetails) => {
    if (!state.cart?.id) return;
    const total = cartDetails.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    );
    try {
      await axios.patch(`${API_URL}/carts/${state.cart.id}`, {
        totalAmount: total,
      });
      dispatch({
        type: "SET_CART",
        payload: { ...state.cart, totalAmount: total },
      });
    } catch (error) {
      console.error("Lỗi cập nhật tổng tiền:", error);
    }
  };

  // --- Thêm sản phẩm ---
  const addToCart = async (product, quantity = 1) => {
    if (!state.cart?.id) return;

    const existing = state.cartDetails.find(
      (item) => Number(item.productId) === Number(product.id)
    );

    const maxQty = product.quantity ?? Infinity;
    const currentQty = existing ? existing.quantity : 0;
    const totalQty = currentQty + quantity;

    if (totalQty > maxQty) {
      return alert(`Sản phẩm "${product.name}" chỉ còn ${maxQty} trong kho.`);
    }

    let updatedCartDetails;

    if (!existing) {
      const { data } = await axios.post(`${API_URL}/cartDetails`, {
        cartId: state.cart.id,
        productId: product.id,
        quantity,
        price: product.finalPrice ?? product.price,
      });
      updatedCartDetails = [...state.cartDetails, data];
    } else {
      const updated = { ...existing, quantity: existing.quantity + quantity };
      await axios.patch(`${API_URL}/cartDetails/${existing.id}`, {
        quantity: updated.quantity,
      });
      updatedCartDetails = state.cartDetails.map((item) =>
        item.id === existing.id ? updated : item
      );
    }

    dispatch({ type: "SET_CART_DETAILS", payload: updatedCartDetails });
    await updateTotalAmount(updatedCartDetails);
  };

  // --- Giảm số lượng ---
  const decreaseQuantity = async (productId) => {
    const existing = state.cartDetails.find(
      (item) => Number(item.productId) === Number(productId)
    );
    if (!existing) return;

    let updatedCartDetails;

    if (existing.quantity > 1) {
      const updated = { ...existing, quantity: existing.quantity - 1 };
      await axios.patch(`${API_URL}/cartDetails/${existing.id}`, {
        quantity: updated.quantity,
      });
      updatedCartDetails = state.cartDetails.map((item) =>
        item.id === existing.id ? updated : item
      );
    } else {
      await axios.delete(`${API_URL}/cartDetails/${existing.id}`);
      updatedCartDetails = state.cartDetails.filter(
        (item) => item.id !== existing.id
      );
    }

    dispatch({ type: "SET_CART_DETAILS", payload: updatedCartDetails });
    await updateTotalAmount(updatedCartDetails);
  };

  // --- Xóa sản phẩm ---
  const removeFromCart = async (productId) => {
    const existing = state.cartDetails.find(
      (item) => Number(item.productId) === Number(productId)
    );
    if (!existing) return;

    await axios.delete(`${API_URL}/cartDetails/${existing.id}`);
    const updatedCartDetails = state.cartDetails.filter(
      (item) => item.id !== existing.id
    );
    dispatch({ type: "SET_CART_DETAILS", payload: updatedCartDetails });
    await updateTotalAmount(updatedCartDetails);
  };

  // --- Xóa toàn bộ giỏ ---
  const clearCart = async () => {
    try {
      await Promise.all(
        state.cartDetails.map((item) =>
          axios.delete(`${API_URL}/cartDetails/${item.id}`)
        )
      );

      dispatch({ type: "CLEAR_CART" });

      if (state.cart?.id) {
        await axios.patch(`${API_URL}/carts/${state.cart.id}`, {
          totalAmount: 0,
        });
        dispatch({
          type: "SET_CART",
          payload: { ...state.cart, totalAmount: 0 },
        });
      }
    } catch (error) {
      console.error("Lỗi khi clear giỏ hàng:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        cartDetails: state.cartDetails,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
