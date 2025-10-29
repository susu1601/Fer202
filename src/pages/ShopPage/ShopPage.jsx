import React, { useContext, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { ProductContext } from "../../contexts/ProductContext";
import { DiscountContext } from "../../contexts/DiscountContext";
import { Link } from 'react-router-dom';

const ShopPage = () => {
    const { products, categories, selectedCategory, setSelectedCategory, setSelectedProduct } = useContext(ProductContext);
    const { discounts } = useContext(DiscountContext);

    const [sortPrice, setSortPrice] = useState("");
    const [sortName, setSortName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 12;



    const filteredProducts = products
        .filter((p) => {
            if (selectedCategory === "all") return true;
            const category = categories.find((c) => c.id === p.categoryId);
            return category?.name === selectedCategory;
        })
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));


    let sortedProducts = [...filteredProducts].map((p) => {
        const discount = discounts.find((d) => d.id === p.discountId && d.isActive);
        const discountPercentage = discount ? discount.amountPercentage : 0;
        const finalPrice = discountPercentage
            ? Math.round(p.price * (1 - discountPercentage / 100))
            : p.price;
        return { ...p, finalPrice };
    });


    if (sortName === "name-asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    if (sortName === "name-desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));


    if (sortPrice === "price-asc") sortedProducts.sort((a, b) => a.finalPrice - b.finalPrice);
    if (sortPrice === "price-desc") sortedProducts.sort((a, b) => b.finalPrice - a.finalPrice);


    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container className="my-5" style={{ minHeight: "80vh" }}>
            <h2 className="fw-bold mb-4 text-center">🛍️ Our Shop</h2>


            <Row className="mb-4 align-items-center g-2">
                <Col md={3}>
                    <Form.Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value={'all'}>All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}>
                        <option value="">Sort by Price...</option>
                        <option value="price-asc">Low → High</option>
                        <option value="price-desc">High → Low</option>
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Select value={sortName} onChange={(e) => setSortName(e.target.value)}>
                        <option value="">Sort by Name...</option>
                        <option value="name-asc">A → Z</option>
                        <option value="name-desc">Z → A</option>
                    </Form.Select>
                </Col>

                <Col md={3}>
                    <Form.Control
                        type="text"
                        placeholder="🔍 Search product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>


            <Row>
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((p) => {
                        const discount = discounts.find((d) => d.id === p.discountId && d.isActive);
                        const discountPercentage = discount ? discount.amountPercentage : 0;


                        return (
                            <Col key={p.id} md={3} sm={6} className="mb-4">
                                <Card
                                    className="h-100 shadow-sm position-relative"
                                    style={{
                                        backgroundColor: "antiquewhite",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                    }}
                                >
                                    {discountPercentage > 0 && (
                                        <Badge
                                            bg="danger"
                                            className="position-absolute top-0 start-0 m-2"
                                            style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                                        >
                                            -{discountPercentage}%
                                        </Badge>
                                    )}

                                    <Card.Img
                                        variant="top"
                                        src={p.image}
                                        style={{
                                            height: "220px",
                                            objectFit: "cover",
                                        }}
                                    />

                                    <Card.Body className="d-flex flex-column justify-content-between">
                                        <div>
                                            <Card.Title
                                                as={Link}
                                                to={`/detail/${p.id}`}
                                                className="fs-6 text-truncate"
                                                onClick={() => setSelectedProduct(p)}
                                            >{p.name}</Card.Title>

                                            {discountPercentage > 0 ? (
                                                <>
                                                    <Card.Text className="text-muted text-decoration-line-through mb-1">
                                                        {p.price.toLocaleString()} VND
                                                    </Card.Text>
                                                    <Card.Text className="fw-semibold text-danger">
                                                        {p.finalPrice.toLocaleString()} VND
                                                    </Card.Text>
                                                </>
                                            ) : (
                                                <Card.Text className="fw-semibold text-dark mb-4">
                                                    {p.price.toLocaleString()} VND
                                                </Card.Text>
                                            )}
                                        </div>

                                        <Button variant="primary" size="sm" className="w-100 mt-2">
                                            🛒 Add to Cart
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <p className="text-center mt-5">No products found 🥲</p>
                )}
            </Row>


            <div className="d-flex justify-content-center mt-4 gap-2">
                <Button
                    variant="outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    ← Prev
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        variant={currentPage === i + 1 ? "info" : "outline-primary"}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
                <Button
                    variant="outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    Next →
                </Button>
            </div>
        </Container>
    );
};

export default ShopPage;
