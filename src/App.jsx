import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { DiscountProvider } from "./contexts/DiscountContext";
import HomePage from "./pages/HomePage/HomePage";
import ShopPage from "./pages/ShopPage/ShopPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import { CartProvider } from "./contexts/CartContext";
import CartPage from "./pages/CartPage/CartPage";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import { OrderProvider } from "./contexts/OrderContext";

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <AuthProvider>
          <ProductProvider>
            <DiscountProvider>
              <Router>
                <Header />
                <main style={{ marginTop: "100px" }}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                  </Routes>
                </main>
              </Router>
            </DiscountProvider>
          </ProductProvider>
        </AuthProvider>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;
