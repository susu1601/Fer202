import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { Dropdown, Nav, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { ProductContext } from "../../contexts/ProductContext";
import { CartContext } from "../../contexts/CartContext";

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { categories, setSelectedCategory } = useContext(ProductContext);
    const { cartDetails } = useContext(CartContext);

    // Tính tổng số sản phẩm trong giỏ
    const totalItems = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="header d-flex justify-content-between align-items-center px-4 py-2 shadow-sm bg-white">
            {/* Logo */}
            <div className="logo">
                <Nav.Link
                    as={Link}
                    to="/"
                    className="logo-link fw-bold fs-4 text-primary text-decoration-none"
                >
                    📚 BookStore
                </Nav.Link>
            </div>

            {/* Navigation */}
            <div className="nav d-flex align-items-center gap-3">
                <Nav.Link
                    as={Link}
                    to="/"
                    className="nav-item fw-semibold text-primary"
                >
                    Home
                </Nav.Link>
                <Nav.Link
                    as={Link}
                    to="/shop"
                    className="nav-item fw-semibold text-primary"
                >
                    Shop
                </Nav.Link>

                {/* Dropdown Categories */}
                <NavDropdown
                    title="Categories"
                    id="categories-dropdown"
                    className="fw-semibold"
                    menuVariant="light"
                >
                    <NavDropdown.Item onClick={() => setSelectedCategory("all")}>
                        All Categories
                    </NavDropdown.Item>

                    {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                            <NavDropdown.Item
                                as={Link}
                                to="/shop"
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                {cat.name}
                            </NavDropdown.Item>
                        ))
                    ) : (
                        <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                    )}
                </NavDropdown>
            </div>

            {/* Actions */}
            <div className="actions d-flex align-items-center gap-5 position-relative">
                <div className="cart position-relative">
                    <Link
                        to="/cart"
                        className="text-decoration-none text-dark fw-semibold"
                    >
                        🛒 Cart
                    </Link>
                    {totalItems > 0 && (
                        <span
                            className="badge bg-danger text-white position-absolute top-0 start-100 translate-middle"
                            style={{
                                borderRadius: "50%",
                                fontSize: "0.7rem",
                                minWidth: "20px",
                                height: "20px",
                                lineHeight: "14px",
                                textAlign: "center",
                            }}
                        >
                            {totalItems}
                        </span>
                    )}
                </div>

                {!user ? (
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                ) : (
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            👤 {user.userName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/account">
                                Account
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/order-history">
                                Historical Orders
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </div>
        </div>
    );
};

export default Header;
