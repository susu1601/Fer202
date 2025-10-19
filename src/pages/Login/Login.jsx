import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import './Login.css';
import { Link } from "react-router-dom"

const Login = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="login-card shadow">
                <h2 className="text-center">Login</h2>
                <p className="text-center text-muted">Enter email and password to continue</p>

                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@email.com"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="••••••"
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="btn-block">
                        Login
                    </Button>
                </Form>

                <p className="text-center mt-3">
                    Do you have an account?
                    <Link to="/register">
                        Sign Up
                    </Link>
                </p>
            </Card>
        </Container>
    );
};

export default Login;