import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import axios from "axios";

const ManageAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("username");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // 🌀 Lấy dữ liệu từ API
    const fetchAccounts = async () => {
        try {
            const res = await axios.get("http://localhost:9999/accounts");
            setAccounts(res.data);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // 🔍 Lọc và sắp xếp
    const filteredAccounts = accounts
        .filter(
            (acc) =>
                acc.username.toLowerCase().includes(search.toLowerCase()) ||
                acc.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const valA = a[sortField]?.toString().toLowerCase() || "";
            const valB = b[sortField]?.toString().toLowerCase() || "";
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    // 📄 Pagination
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const paginatedAccounts = filteredAccounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 🔁 Toggle status (local + gửi PATCH nếu có backend hỗ trợ)
    const toggleStatus = async (id) => {
        const updatedAccounts = accounts.map((acc) =>
            acc.id === id
                ? { ...acc, status: acc.status === "active" ? "inactive" : "active" }
                : acc
        );
        setAccounts(updatedAccounts);

        // 👇 Nếu bạn có API update status (vd: PATCH /accounts/:id)
        // try {
        //   const target = updatedAccounts.find(acc => acc.id === id);
        //   await axios.patch(`http://localhost:9999/accounts/${id}`, { status: target.status });
        // } catch (err) {
        //   console.error("Error updating status:", err);
        // }
    };

    // 🔀 Sort
    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    }, [filteredAccounts]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-3">Manage Accounts</h2>

            {/* 🔍 Search */}
            <InputGroup className="mb-3 w-50">
                <Form.Control
                    type="text"
                    placeholder="Search by username or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </InputGroup>

            {/* 🧾 Table */}
            <Table bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th onClick={() => handleSort("username")} style={{ cursor: "pointer" }}>
                            Username {sortField === "username" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Email</th>
                        <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                            Role {sortField === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Status</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAccounts.length > 0 ? (
                        paginatedAccounts.map((acc) => (
                            <tr key={acc.id}>
                                <td>{acc.username}</td>
                                <td>{acc.email}</td>
                                <td>{acc.role}</td>
                                <td
                                    className={
                                        acc.status === "active" ? "text-success fw-semibold" : "text-danger fw-semibold"
                                    }
                                >
                                    {acc.status}
                                </td>
                                <td>{acc.phoneNumber || "-"}</td>
                                <td>{acc.address}</td>
                                <td>
                                    <Button
                                        variant={acc.status === "active" ? "outline-danger" : "outline-success"}
                                        size="sm"
                                        onClick={() => toggleStatus(acc.id)}
                                    >
                                        {acc.status === "active" ? "Deactivate" : "Activate"}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No accounts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* ⏭ Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                    Page {currentPage} of {totalPages}
                </div>
                <div>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="me-2"
                    >
                        Prev
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ManageAccounts;
