import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AuthProvider } from "./contexts/AuthContext";
import { ProductContext, ProductProvider } from "./contexts/ProductContext";
import { DiscountContext, DiscountProvider } from "./contexts/DiscountContext";
import HomePage from "./pages/HomePage/HomePage";
import ShopPage from "./pages/ShopPage/ShopPage";
import DetailPage from './pages/DetailPage/DetailPage';

function App() {


  return (
    <>
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
                </Routes>
              </main>
            </Router>
          </DiscountProvider>
        </ProductProvider>
      </AuthProvider >



    </>
  )
}

export default App
