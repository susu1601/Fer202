import React, { useContext, useState } from "react";
import { CartContext } from "./../../contexts/CartContext";
import { ProductContext } from "./../../contexts/ProductContext";
import { DiscountContext } from "./../../contexts/DiscountContext";
import { OrderContext } from "./../../contexts/OrderContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Form,
} from "react-bootstrap";
import { Trash } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header/Header";

const CartPage = () => {
  const navigate = useNavigate();
  const { discounts } = useContext(DiscountContext);
  const { products } = useContext(ProductContext);
  const { addOrder } = useContext(OrderContext);
  const {
    cartDetails,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedIds, setSelectedIds] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(user?.address || "");

  const calculateDiscountedPrice = (product) => {
    if (!product.discountId) return product.price;
    const discount = discounts.find(
      (d) => Number(d.id) === Number(product.discountId) && d.isActive
    );
    return discount
      ? Math.round(product.price * (1 - discount.amountPercentage / 100))
      : product.price;
  };

  const mergedCart = cartDetails
    .map((detail) => {
      const product = products.find((p) => p.id === detail.productId);
      if (!product) return null;
      return { product, quantityInCart: detail.quantity };
    })
    .filter(Boolean);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheckout = async () => {
    if (selectedIds.length === 0) {
      alert("Please choose at least 1 items to checkout!");
      return;
    }
    if (!shippingAddress.trim()) {
      alert("Please enter the address!");
      return;
    }
    if (!user?.id) {
      alert("You need to login!");
      return;
    }

    const selectedItems = mergedCart.filter((item) =>
      selectedIds.includes(item.product.id)
    );

    // Chuẩn bị thông tin đơn hàng
    const order = {
      userId: user.id,
      shippingAddress,
      date: new Date().toISOString().split("T")[0],
      status: "Progress",
    };

    // Chuẩn bị chi tiết đơn hàng
    const orderDetails = selectedItems.map(({ product, quantityInCart }) => ({
      productId: String(product.id),
      quantity: quantityInCart,
      price: calculateDiscountedPrice(product),
    }));

    try {
      // Sử dụng hàm addOrder từ OrderContext
      await addOrder(order, orderDetails);

      // Tìm các cartDetail cần xóa
      const itemsToRemove = selectedItems
        .map(({ product }) => {
          return cartDetails.find(
            (d) => String(d.productId) === String(product.id)
          );
        })
        .filter(Boolean);

      // Xóa đồng thời tất cả từ API
      await Promise.all(
        itemsToRemove.map((item) =>
          axios.delete(`http://localhost:9999/cartDetails/${item.id}`)
        )
      );

      // Navigate và hiện thông báo
      setSelectedIds([]);
      navigate("/order-history");

      setTimeout(() => {
        alert("Order successfully!");
      }, 100);
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Check out error. Please try again!");
    }
  };

  return (
    <>
      <Header />
      <Container fluid className="bg-[#f8f6ef] min-h-screen py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-semibold">🛒 Cart</h3>
              {mergedCart.length > 0 && (
                <Button variant="outline-danger" size="sm" onClick={clearCart}>
                  <Trash size={16} className="me-1" />
                  Delete the Cart
                </Button>
              )}
            </div>

            {mergedCart.length === 0 ? (
              <p>Cart is empty.</p>
            ) : (
              mergedCart.map(({ product, quantityInCart }) => {
                const discountedPrice = calculateDiscountedPrice(product);
                const isDiscounted = discountedPrice < product.price;

                return (
                  <Card
                    key={product.id}
                    className="mb-3 shadow-sm border-0 rounded-3"
                  >
                    <Card.Body className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="me-3"
                      />
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="rounded me-3"
                        style={{
                          width: "90px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Subtitle className="text-muted mb-2">
                          {product.author}
                        </Card.Subtitle>

                        <div className="d-flex align-items-baseline gap-2">
                          <span className="fw-bold text-primary">
                            {discountedPrice.toLocaleString()}đ
                          </span>
                          {isDiscounted && (
                            <span className="text-decoration-line-through text-muted small">
                              {product.price.toLocaleString()}đ
                            </span>
                          )}
                        </div>

                        <div className="mt-3 d-flex align-items-center gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decreaseQuantity(product.id)}
                          >
                            −
                          </Button>
                          <span className="px-3">{quantityInCart}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => addToCart(product, 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="link"
                        className="text-danger ms-3"
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Trash size={18} />
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })
            )}
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body>
                <h5 className="mb-3 fw-semibold">Total</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter the address..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mb-2">
                  <span>Temporary Count</span>
                  <span>
                    {mergedCart
                      .filter((i) => selectedIds.includes(i.product.id))
                      .reduce(
                        (sum, { product, quantityInCart }) =>
                          sum +
                          calculateDiscountedPrice(product) * quantityInCart,
                        0
                      )
                      .toLocaleString()}
                    đ
                  </span>
                </div>

                <hr />

                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  onClick={handleCheckout}
                >
                  Check Out
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  as={Link}
                  to="/shop"
                >
                  Continue to buy
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

    </>

  );
};

export default CartPage;
