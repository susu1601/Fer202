import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { Dropdown, Nav, NavDropdown } from 'react-bootstrap';
import { AuthContext } from "../../contexts/AuthContext";
import { ProductContext } from "../../contexts/ProductContext";

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { categories, setSelectedCategory } = useContext(ProductContext);

    return (
        <div className="header" >
            <div className="logo">
                <Nav.Link as={Link} to="/" className="logo-link">BookStore</Nav.Link>
            </div>

            <div className="nav">
                <Nav.Link as={Link} to="/" className="nav-item">HomePage</Nav.Link>
                <Nav.Link as={Link} to="/shop" className="nav-item">Shop</Nav.Link>
                <NavDropdown
                    title="Categories"
                    id="categories-dropdown"
                    className="nav-item text-dark fw-semibold"
                    style={{
                        color: "#333",
                        fontSize: "16px",
                        marginLeft: "20px",
                    }}
                    menuVariant="light"
                >
                    <NavDropdown.Item onClick={() => setSelectedCategory("all")}
                        style={{
                            fontWeight: "600",
                            color: "#0d6efd",
                            padding: "10px 20px",
                            borderBottom: "1px solid #f1f1f1",
                            transition: "background 0.3s, color 0.3s",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#f8f9fa")}
                        onMouseLeave={(e) => (e.target.style.background = "transparent")}>
                        All Categories
                    </NavDropdown.Item>
                    {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                            <NavDropdown.Item
                                as={Link}
                                to="/shop"
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                style={{
                                    fontWeight: "600",
                                    color: "#0d6efd",
                                    padding: "10px 20px",
                                    borderBottom: "1px solid #f1f1f1",
                                    transition: "background 0.3s, color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.target.style.background = "#f8f9fa")}
                                onMouseLeave={(e) => (e.target.style.background = "transparent")}
                            >
                                {cat.name}
                            </NavDropdown.Item>
                        ))
                    ) : (
                        <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                    )}
                </NavDropdown>
            </div>

            <div className="actions">
                <div className="cart">🛒 Cart</div>
                {!user ?
                    (<Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>)
                    :
                    (<Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            👤 {user.userName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
                            <Dropdown.Item as={Link} to="/account">Account</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/orders">Historical Orders</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>)


                }

            </div>
        </div>
    );
};

export default Header;
