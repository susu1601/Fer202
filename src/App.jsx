import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AuthProvider } from "./contexts/AuthContext";

function App() {


  return (
    <>
      <AuthProvider>
        <Router>
          <Header />
          <Routes >

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<h2 className="text-center mt-5">Trang chủ</h2>} />
          </Routes>

        </Router>
      </AuthProvider>



    </>
  )
}

export default App
