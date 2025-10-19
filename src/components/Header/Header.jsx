import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { Nav } from 'react-bootstrap';

const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                <Nav.Link as={Link} to="/" className="logo-link">BookStore</Nav.Link>
            </div>

            <div className="nav">
                <Nav.Link as={Link} to="/" className="nav-item">HomePage</Nav.Link>
                <Nav.Link as={Link} to="/" className="nav-item">Categories</Nav.Link>
                <Nav.Link as={Link} to="/" className="nav-item">Description</Nav.Link>
                <Nav.Link as={Link} to="/" className="nav-item">Contact</Nav.Link>

            </div>

            <div className="actions">
                <div className="cart">🛒 Cart</div>

                <Link to="/login">
                    <button className="login-btn">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Header;
