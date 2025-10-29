import React, { useContext, useRef } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { ProductContext } from '../../contexts/ProductContext';
import { DiscountContext } from './../../contexts/DiscountContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookSection = ({ title, books, discounts }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="position-relative" >
            <h3 className="fw-bold mb-4">{title}</h3>


            <Button
                variant="light"
                className="position-absolute top-50 start-0 translate-middle-y shadow-sm"
                onClick={() => scroll("left")}
                style={{
                    zIndex: 5,
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                }}
            >
                <ChevronLeft />
            </Button>


            <div
                ref={scrollRef}
                className="d-flex pb-3"
                style={{
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    gap: "1rem",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >

                <style>
                    {`
            div::-webkit-scrollbar {
              display: none;
            }
          `}
                </style>

                {books.map((book) => {
                    const discount = discounts.find((d) => d.id === book.discountId && d.isActive);
                    const discountPercentage = discount ? discount.amountPercentage : 0;
                    const finalPrice = discountPercentage
                        ? Math.round(book.price * (1 - discountPercentage / 100))
                        : book.price;

                    return (
                        <Card

                            key={book.id}
                            className="shadow-sm position-relative flex-shrink-0 d-flex flex-column justify-content-between"
                            style={{
                                width: "calc(20% - 0.8rem)",
                                minWidth: "220px",
                                borderRadius: "12px",
                                height: "380px",
                                backgroundColor: "antiquewhite"

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
                                src={book.image}
                                style={{
                                    height: "220px",
                                    objectFit: "cover",
                                    borderTopLeftRadius: "12px",
                                    borderTopRightRadius: "12px",
                                }}
                            />

                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <Card.Title
                                        as={Link}
                                        to={`/detail/${book.id}`} className="fs-6 text-truncate">{book.name}</Card.Title>

                                    {discountPercentage > 0 ? (
                                        <>
                                            <Card.Text className="text-muted text-decoration-line-through mb-1">
                                                {book.price.toLocaleString()} VND
                                            </Card.Text>
                                            <Card.Text className="fw-semibold text-danger">
                                                {finalPrice.toLocaleString()} VND
                                            </Card.Text>
                                        </>
                                    ) : (
                                        <Card.Text className="fw-semibold text-dark mb-4">
                                            {book.price.toLocaleString()} VND
                                        </Card.Text>
                                    )}
                                </div>

                                <Button variant="primary" size="sm" className="w-100 mt-2">
                                    Add to cart
                                </Button>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>

            {/* Nút phải */}
            <Button
                variant="light"
                className="position-absolute top-50 end-0 translate-middle-y shadow-sm"
                onClick={() => scroll("right")}
                style={{
                    zIndex: 5,
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                }}
            >
                <ChevronRight />
            </Button>
        </div>
    );
};
const HomePage = () => {
    const { products } = useContext(ProductContext);
    const { discounts } = useContext(DiscountContext);

    const newProducts = [...products]
        .filter((p) => p.entrydate)
        .sort((a, b) => new Date(b.entrydate) - new Date(a.entrydate))
        .slice(0, 10);

    const hotProducts = products.filter((p) => p.isHot).slice(0, 10);

    const topDiscountProducts = products
        .filter((p) => {
            const discount = discounts.find((d) => d.id === p.discountId && d.isActive);
            return discount;
        })
        .sort((a, b) => {
            const discA = discounts.find((d) => d.id === a.discountId)?.amountPercentage || 0;
            const discB = discounts.find((d) => d.id === b.discountId)?.amountPercentage || 0;
            return discB - discA;
        })
        .slice(0, 10);

    return (
        <Container className="my-5 " >
            <BookSection title="📚 New Book" books={newProducts} discounts={discounts} />
            <BookSection title="🔥 Hot Book" books={hotProducts} discounts={discounts} />
            <BookSection title="💸 Discount Book" books={topDiscountProducts} discounts={discounts} />
        </Container>
    );
};

export default HomePage;
