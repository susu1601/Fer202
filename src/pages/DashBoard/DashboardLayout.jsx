import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import HeaderDash from './../../components/HeaderDash/HeaderDash';
import SideBar from './../../components/SideBar/SideBar';

const DashboardLayout = () => {
    return (
        <>
            <HeaderDash />
            <Row className="m-0">
                <Col md={3} className="p-0">
                    <SideBar />
                </Col>
                <Col md={9} className="p-4">
                    <Outlet />
                </Col>
            </Row>
        </>
    );
};

export default DashboardLayout;