import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { ProductContext } from "../../contexts/ProductContext";
import { OrderContext } from "../../contexts/OrderContext";
import Header from "../../components/Header/Header";

const OrderHistory = () => {
  const { products } = useContext(ProductContext);
  const { orderDetails, getUserOrders } = useContext(OrderContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const userOrders = getUserOrders(user?.id);

  return (
    <>
      <Header />
      <div className="container py-4">
        <h3 className="mb-4 fw-bold">Order History</h3>

        {userOrders.length === 0 ? (
          <p>You do not have any order.</p>
        ) : (
          userOrders
            .sort((a, b) => b.id - a.id)
            .map((order) => {
              const details = orderDetails.filter((d) => d.orderId === order.id);

              const totalAmount = details.reduce(
                (sum, d) => sum + d.price * d.quantity,
                0
              );

              return (

                <Card
                  key={order.id}
                  className="mb-3 shadow-sm border-0"
                  style={{ background: "#fefcf7", borderRadius: "10px" }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-semibold">Orders #{order.id}</h5>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${order.status === "Success"
                          ? "bg-success-subtle text-success"
                          : order.status === "Cancel"
                            ? "bg-danger-subtle text-danger"
                            : "bg-warning-subtle text-dark"
                          }`}
                      >
                        {order.status || "Progress"}
                      </span>
                    </div>

                    <div className="text-muted mb-2">
                      📅 {order.date} &nbsp;&nbsp; 💰{" "}
                      {totalAmount.toLocaleString("vi-VN")}đ
                    </div>

                    {details.map((d) => {
                      const product = products.find((p) => p.id === d.productId);
                      if (!product) return null;

                      return (
                        <div
                          key={d.id}
                          className="d-flex align-items-center mb-2"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            width={60}
                            height={80}
                            className="rounded me-3"
                            style={{
                              objectFit: "cover",
                              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            }}
                          />
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            <div className="text-muted small">
                              {product.author}
                            </div>
                            {/* ✅ Dùng giá từ orderDetails */}
                            <div className="small">
                              {d.price.toLocaleString("vi-VN")}đ × {d.quantity}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Card.Body>
                </Card>
              );
            })
        )}
      </div>
    </>

  );
};

export default OrderHistory;
