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
import ManageProduct from "./pages/ManageProduct/ManageProduct";
import DashBoard from "./pages/DashBoard/DashBoard";
import DashboardLayout from "./pages/DashBoard/DashBoardLayout";
import ManageCategories from "./pages/ManageCategories/ManageCategories";
import ManageAccounts from "./pages/ManageAccounts/ManageAccounts";
import ManageOrders from "./pages/ManageOrders/ManageOrders";
import ManageDiscounts from "./pages/ManageDiscounts/ManageDiscounts";
import AccountProfile from "./pages/AccountProfile/AccountProfile";

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <AuthProvider>
          <ProductProvider>
            <DiscountProvider>
              <Router>
                <main style={{ marginTop: "100px" }}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<AccountProfile />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/order-history" element={<OrderHistory />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route index element={<DashBoard />} />
                      <Route path="manageproducts" element={<ManageProduct />} />
                      <Route path="managecategories" element={<ManageCategories />} />
                      <Route path="managediscounts" element={<ManageDiscounts />} />
                      <Route path="manageaccounts" element={<ManageAccounts />} />
                      <Route path="manageorders" element={<ManageOrders />} />
                    </Route>


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
