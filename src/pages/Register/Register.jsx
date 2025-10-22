import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""

        }
    );

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { username, email, password, confirmPassword } = formData;

        if (!username || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.get('http://localhost:9999/accounts');
            const users = res.data;

            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                setError("Email already exists!");
                return;
            }

            const lastId = users.length > 0 ? users[users.length - 1].id : 0;
            const newUser = {
                id: lastId + 1,
                username,
                email,
                password,
                status: "active",
                role: "User",
                phoneNumber: "",
                address: ""
            };

            await axios.post('http://localhost:9999/accounts', newUser);
            setSuccess("Register successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 1000);
        } catch (error) {
            setError("Something went wrong!");
            console.error(error);
        }
    }

    return (
        <div id="register-form" style={{ maxWidth: '600px', margin: 'auto', marginTop: '200px' }}>
            <Card>
                <Card.Body>
                    <Card.Title className="text-center" style={{ fontSize: '30px' }}><strong>Register</strong></Card.Title>
                    <Card.Text className="text-center">
                        Create a new account to start shopping.
                    </Card.Text>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>UserName</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                required
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                required
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="confirm-password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"

                                required
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange} />
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