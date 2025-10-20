import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { Dropdown, Nav } from 'react-bootstrap';
import { AuthContext } from "../../contexts/AuthContext";

const Header = () => {
    const { user, logout } = useContext(AuthContext);
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
