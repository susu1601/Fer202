import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AuthProvider } from "./contexts/AuthContext";
import { ProductContext, ProductProvider } from "./contexts/ProductContext";
import { DiscountContext, DiscountProvider } from "./contexts/DiscountContext";
import HomePage from "./pages/HomePage/HomePage";

function App() {


  return (
    <>
      <AuthProvider>
        <ProductProvider>
          <DiscountProvider>
            <Router>
              <Header />
              <Routes >

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Router>
          </DiscountProvider>
        </ProductProvider>
      </AuthProvider>



    </>
  )
}

export default App
