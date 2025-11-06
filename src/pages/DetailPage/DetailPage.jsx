import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { ProductContext } from "../../contexts/ProductContext";
import { DiscountContext } from "../../contexts/DiscountContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CartContext } from "../../contexts/CartContext";
import Header from "../../components/Header/Header";

const DetailPage = () => {
    const { id } = useParams();
    const { products, selectedProduct } = useContext(ProductContext);
    const { discounts } = useContext(DiscountContext);
    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(selectedProduct || null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const scrollRef = useRef(null);
    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({
                left:
                    direction === "left"
                        ? scrollLeft - scrollAmount
                        : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        if (selectedProduct && selectedProduct.id === parseInt(id)) {
            setProduct(selectedProduct);
        } else {
            const found = products.find((p) => Number(p.id) === parseInt(id));
            setProduct(found || null);
        }
    }, [id, products, selectedProduct]);

    useEffect(() => {
        if (product && products.length > 0) {
            const related = products.filter(
                (p) => p.categoryId === product.categoryId && p.id !== product.id
            );
            setRelatedProducts(related);
        } else {
            setRelatedProducts([]);
        }
    }, [product, products]);

    if (!product) return <h4 className="text-center my-5">Loading product...</h4>;

    const discount = discounts.find(
        (d) => d.id === product.discountId && (d.isActive ?? true)
    );

    const discountPercentage = discount
        ? discount.amountPercentage ?? discount.percentage ?? 0
        : 0;
    const finalPrice =
        discountPercentage > 0
            ? Math.round(product.price * (1 - discountPercentage / 100))
            : product.price;

    return (
        <>
            <Header />
            <div
                style={{
                    backgroundColor: "#faf7f2",
                    minHeight: "100vh",
                    padding: "40px 0",
                }}
            >
                <Container>
                    <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Detail Product</h3>

                    <Row className="align-items-start">
                        <Col md={6} lg={5} className="mb-4">
                            <div
                                style={{
                                    background: "#fff",
                                    padding: 20,
                                    borderRadius: 12,
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        maxWidth: 520,
                                        borderRadius: 10,
                                        objectFit: "cover",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                                    }}
                                />
                            </div>
                        </Col>

                        <Col md={6} lg={7}>
                            <div
                                style={{
                                    background: "#fff",
                                    padding: 26,
                                    borderRadius: 12,
                                    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
                                }}
                            >
                                <h2 style={{ fontSize: 28, marginBottom: 8 }}>{product.name}</h2>
                                <p style={{ color: "#6c757d", marginBottom: 6 }}>
                                    Author by:{" "}
                                    <span style={{ fontWeight: 600, color: "#222" }}>
                                        {product.author}
                                    </span>
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginBottom: 16,
                                    }}
                                >
                                    <div style={{ color: "#e63946", fontSize: 14 }}>★★★★★</div>
                                    <div style={{ color: "#444", fontSize: 14 }}>4.7</div>
                                </div>

                                <div style={{ marginBottom: 18 }}>
                                    {discountPercentage > 0 ? (
                                        <>
                                            <div
                                                style={{
                                                    textDecoration: "line-through",
                                                    color: "#8a8a8a",
                                                    fontSize: 16,
                                                }}
                                            >
                                                {product.price.toLocaleString()} VND
                                            </div>
                                            <div
                                                style={{ display: "flex", alignItems: "center", gap: 12 }}
                                            >
                                                <h3 style={{ color: "#d9534f", margin: 0 }}>
                                                    {finalPrice.toLocaleString()} VND
                                                </h3>
                                                <Badge bg="danger" style={{ borderRadius: 8 }}>
                                                    -{discountPercentage}%
                                                </Badge>
                                            </div>
                                        </>
                                    ) : (
                                        <h3 style={{ margin: 0, color: "#222" }}>
                                            {product.price.toLocaleString()} VND
                                        </h3>
                                    )}
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    style={{
                                        width: "100%",
                                        borderRadius: 8,
                                        padding: "12px 18px",
                                        fontWeight: 700,
                                    }}
                                    onClick={() => addToCart(product)}
                                >
                                    🛒 Add to Cart
                                </Button>

                                <div style={{ marginTop: 20 }}>
                                    <h5 style={{ marginBottom: 8 }}>Description</h5>
                                    <p style={{ color: "#6c757d", lineHeight: 1.6 }}>
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 36,
                        }}
                    >
                        <h4 style={{ margin: 0, fontWeight: 700 }}>Related Products</h4>
                    </div>

                    <div style={{ position: "relative", marginTop: 16 }}>
                        <Button
                            variant="light"
                            onClick={() => scroll("left")}
                            aria-label="scroll-left"
                            style={{
                                position: "absolute",
                                left: -10,
                                top: "40%",
                                zIndex: 5,
                                borderRadius: "50%",
                                width: 44,
                                height: 44,
                                display: relatedProducts.length ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                            }}
                        >
                            <ChevronLeft size={18} />
                        </Button>

                        {/* Scroll container */}
                        <div
                            ref={scrollRef}
                            className="related-scroll"
                            style={{
                                display: "flex",
                                gap: 26,
                                overflowX: "auto",
                                paddingBottom: 8,
                                scrollBehavior: "smooth",
                            }}
                        >
                            <style>
                                {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
                            </style>

                            {relatedProducts.length > 0 ? (
                                relatedProducts.map((p) => {
                                    const dis = discounts.find(
                                        (d) => d.id === p.discountId && (d.isActive ?? true)
                                    );
                                    const disPercent = dis
                                        ? dis.amountPercentage ?? dis.percentage ?? 0
                                        : 0;
                                    const finalP = disPercent
                                        ? Math.round(p.price * (1 - disPercent / 100))
                                        : p.price;

                                    return (
                                        <Card
                                            key={p.id}
                                            style={{
                                                minWidth: 220,
                                                width: 235,
                                                borderRadius: 12,
                                                overflow: "hidden",
                                                background: "#fff",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                                                flex: "0 0 auto",
                                            }}
                                        >
                                            {disPercent > 0 && (
                                                <Badge
                                                    bg="danger"
                                                    style={{
                                                        position: "absolute",
                                                        margin: 8,
                                                        zIndex: 3,
                                                        borderRadius: 8,
                                                    }}
                                                >
                                                    -{disPercent}%
                                                </Badge>
                                            )}
                                            <Link
                                                to={`/detail/${p.id}`}
                                                style={{ textDecoration: "none", color: "inherit" }}
                                            >
                                                <div style={{ height: 190, overflow: "hidden" }}>
                                                    <img
                                                        src={p.image}
                                                        alt={p.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                                <Card.Body style={{ padding: "12px" }}>
                                                    <Card.Title
                                                        style={{
                                                            fontSize: 14,
                                                            height: 36,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {p.name}
                                                    </Card.Title>
                                                    <div style={{ marginTop: 6 }}>
                                                        {disPercent > 0 ? (
                                                            <>
                                                                <div
                                                                    style={{
                                                                        textDecoration: "line-through",
                                                                        color: "#888",
                                                                        fontSize: 13,
                                                                    }}
                                                                >
                                                                    {p.price.toLocaleString()} VND
                                                                </div>
                                                                <div
                                                                    style={{ color: "#d9534f", fontWeight: 700 }}
                                                                >
                                                                    {finalP.toLocaleString()} VND
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div style={{ fontWeight: 700 }}>
                                                                {p.price.toLocaleString()} VND
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Link>
                                        </Card>
                                    );
                                })
                            ) : (
                                <div style={{ padding: 12, color: "#888" }}>
                                    Không có sản phẩm liên quan
                                </div>
                            )}
                        </div>

                        {/* Right button */}
                        <Button
                            variant="light"
                            onClick={() => scroll("right")}
                            aria-label="scroll-right"
                            style={{
                                position: "absolute",
                                right: -10,
                                top: "40%",
                                zIndex: 5,
                                borderRadius: "50%",
                                width: 44,
                                height: 44,
                                display: relatedProducts.length ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                            }}
                        >
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </Container>
            </div>
        </>

    );
};

export default DetailPage;
