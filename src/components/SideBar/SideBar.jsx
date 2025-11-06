import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <ListGroup>
            <ListGroup.Item>
                <Link to="/dashboard/manageproducts" className="text-decoration-none text-dark">
                    Manage Products
                </Link>
            </ListGroup.Item>
            <ListGroup.Item>
                <Link to="/dashboard/managecategories" className="text-decoration-none text-dark">
                    Manage Categories
                </Link>
            </ListGroup.Item>
            <ListGroup.Item>
                <Link to="/dashboard/managediscounts" className="text-decoration-none text-dark">
                    Manage Discounts
                </Link>
            </ListGroup.Item>
            <ListGroup.Item>
                <Link to="/dashboard/manageaccounts" className="text-decoration-none text-dark">
                    Manage Accounts
                </Link>
            </ListGroup.Item>
            <ListGroup.Item>
                <Link to="/dashboard/manageorders" className="text-decoration-none text-dark">
                    Manage Orders
                </Link>
            </ListGroup.Item>
        </ListGroup>
    );
};

export default SideBar;
