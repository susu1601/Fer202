import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const OrderContext = createContext();
const API_URL = "http://localhost:9999";

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  // --- Fetch orders & orderDetails ---
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`);
      setOrders(data);
    } catch (err) {
      console.error("Lỗi khi tải orders:", err);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/orderDetails`);
      setOrderDetails(data);
    } catch (err) {
      console.error("Lỗi khi tải orderDetails:", err);
    }
  };

  // --- Lấy đơn hàng user + chi tiết + tổng tiền ---
  const getUserOrders = (userId) => {
    return orders
      .filter((o) => Number(o.userId) === Number(userId))
      .map((order) => {
        const details = orderDetails.filter(
          (d) => Number(d.orderId) === Number(order.id)
        );
        const totalAmount = details.reduce(
          (sum, d) => sum + d.price * d.quantity,
          0
        );
        return { ...order, details, totalAmount };
      });
  };

  // --- Thêm đơn hàng ---
  const addOrder = async (order, details) => {
    try {
      const newOrder = {
        userId: Number(order.userId),
        date: order.date || new Date().toISOString().slice(0, 10),
        shippingAddress: order.shippingAddress,
        status: order.status || "Đang xử lý",
        totalAmount: details.reduce((sum, d) => sum + d.price * d.quantity, 0),
      };

      const { data: createdOrder } = await axios.post(
        `${API_URL}/orders`,
        newOrder
      );

      // --- Thêm tất cả chi tiết & trừ kho đồng thời ---
      const createdDetails = await Promise.all(
        details.map(async (item) => {
          // Tạo orderDetail
          const { data: newDetail } = await axios.post(
            `${API_URL}/orderDetails`,
            {
              orderId: createdOrder.id,
              productId: String(item.productId),
              quantity: item.quantity,
              price: item.price,
            }
          );

          // Trừ kho
          const { data: product } = await axios.get(
            `${API_URL}/products/${item.productId}`
          );
          await axios.patch(`${API_URL}/products/${item.productId}`, {
            quantity: product.quantity - item.quantity,
          });

          return newDetail;
        })
      );

      // Cập nhật state local
      setOrders((prev) => [createdOrder, ...prev]);
      setOrderDetails((prev) => [...createdDetails, ...prev]);

      return createdOrder;
    } catch (err) {
      console.error("Lỗi khi thêm đơn hàng:", err);
      throw err;
    }
  };

  // --- Cập nhật trạng thái ---
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data: order } = await axios.get(`${API_URL}/orders/${orderId}`);
      const details = orderDetails.filter(
        (d) => Number(d.orderId) === Number(orderId)
      );

      if (newStatus === "Đã hủy") {
        await Promise.all(
          details.map(async (item) => {
            const { data: product } = await axios.get(
              `${API_URL}/products/${item.productId}`
            );
            await axios.patch(`${API_URL}/products/${item.productId}`, {
              quantity: product.quantity + item.quantity,
            });
          })
        );
      }

      const { data: updated } = await axios.patch(
        `${API_URL}/orders/${orderId}`,
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: updated.status } : o
        )
      );

      return updated;
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderDetails();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        orderDetails,
        getUserOrders,
        addOrder,
        updateOrderStatus,
        fetchOrders,
        fetchOrderDetails,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
