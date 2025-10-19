import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import "./Register.css"
import { Link } from "react-router-dom"

const Register = () => {
    return (
        <div id="register-form" style={{ maxWidth: '600px', margin: 'auto', marginTop: '200px' }}>
            <Card>
                <Card.Body>
                    <Card.Title className="text-center" style={{ fontSize: '30px' }}><strong>Register</strong></Card.Title>
                    <Card.Text className="text-center">
                        Create a new account to start shopping.
                    </Card.Text>
                    <Form>
                        <Form.Group controlId="fullname">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" required placeholder="Enter your full name" />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required placeholder="Enter your email" />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required placeholder="Enter your password" />
                        </Form.Group>
                        <Form.Group controlId="confirm-password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" required placeholder="Confirm your password" />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="btn-block">
                            Register
                        </Button>
                        <p className="text-center mt-3">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Register;