import React, { useContext, useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {

            const res = await axios.get('http://localhost:9999/accounts');

            const user = res.data.find(
                (u) => u.email === email && u.password === password
            );

            if (user) {
                alert(`Welcome back, ${user.username} !`);
                login(user);
                navigate('/');
            } else {
                setError("Invalid Email or password.");
            }


        } catch (error) {
            console.log(error);
            setError('Sever error. Please try again later.')

        }

    };


    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="login-card shadow">
                <h2 className="text-center">Login</h2>
                <p className="text-center text-muted">Enter email and password to continue</p>

                {error && <Alert variant='danger'>{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="*******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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