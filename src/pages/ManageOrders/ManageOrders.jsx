import React, { useEffect, useState } from "react";
import { Table, Button, InputGroup, Form, Spinner, Alert } from "react-bootstrap";

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [sortField, setSortField] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = "http://localhost:9999/orders";

    // Fetch data từ API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Search + Filter + Sort
    const filteredOrders = orders
        .filter((o) => {
            const matchesSearch =
                o.id.toLowerCase().includes(search.toLowerCase()) ||
                o.shippingAddress.toLowerCase().includes(search.toLowerCase()) ||
                o.date.includes(search);
            const matchesStatus =
                filterStatus === "All" ? true : o.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            // Nếu là số (vd totalAmount), sort theo số
            if (typeof valA === "number" && typeof valB === "number") {
                return sortOrder === "asc" ? valA - valB : valB - valA;
            }
            // Nếu là string hoặc date
            const aStr = valA?.toString().toLowerCase() || "";
            const bStr = valB?.toString().toLowerCase() || "";
            if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
            if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    // Toggle status (Progress <-> Success)
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Progress" ? "Success" : "Progress";
        try {
            await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
            );
        } catch (err) {
            alert("❌ Failed to update status: " + err.message);
        }
    };

    // Xử lý sort
    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading orders...</p>
            </div>
        );

    if (error)
        return (
            <Alert variant="danger" className="text-center mt-5">
                {error}
            </Alert>
        );

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-3">Manage Orders</h2>

            {/* Search + Filter */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
                <InputGroup className="w-50">
                    <Form.Control
                        type="text"
                        placeholder="Search by ID, date, or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>

                <Form.Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-auto"
                >
                    <option value="All">All Status</option>
                    <option value="Progress">Progress</option>
                    <option value="Success">Success</option>
                </Form.Select>
            </div>

            {/* Table */}
            <Table bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
                            Order ID {sortField === "id" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>
                            Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Shipping Address</th>
                        <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                            Status {sortField === "status" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th
                            onClick={() => handleSort("totalAmount")}
                            style={{ cursor: "pointer" }}
                        >
                            Total (VND){" "}
                            {sortField === "totalAmount" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.shippingAddress}</td>
                                <td
                                    className={
                                        order.status === "Success"
                                            ? "text-success fw-semibold"
                                            : "text-warning fw-semibold"
                                    }
                                >
                                    {order.status}
                                </td>
                                <td>{order.totalAmount.toLocaleString()}</td>
                                <td>
                                    <Button
                                        variant={
                                            order.status === "Progress" ? "outline-success" : "outline-warning"
                                        }
                                        size="sm"
                                        onClick={() => toggleStatus(order.id, order.status)}
                                    >
                                        {order.status === "Progress" ? " Success" : " Progress"}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ManageOrders;
