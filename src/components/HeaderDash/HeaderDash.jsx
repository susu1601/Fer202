import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Nav } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";

const HeaderDash = () => {
    const { user, logout } = useContext(AuthContext);




    return (
        <div style={{ height: '80px' }} className="header d-flex justify-content-between align-items-center  shadow-sm bg-white">
            {/* Logo */}
            <div className="logo">
                <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className="logo-link fw-bold fs-4 text-primary text-decoration-none"
                >
                    📚 DashBoard
                </Nav.Link>
            </div>

            {/* Actions */}
            <div className="actions d-flex align-items-center gap-5 position-relative">
                {!user ? (
                    <Link to="/login">
                        <button className="login-btn">Login</button>
                    </Link>
                ) : (
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            👤 Admin
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={logout}>Log Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </div>
        </div>
    );
};

export default HeaderDash;
