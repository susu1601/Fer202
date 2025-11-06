import React, { useEffect, useState } from "react";
import {
    Table,
    Button,
    InputGroup,
    Form,
    Modal,
    Alert,
    Spinner,
} from "react-bootstrap";

const ManageDiscounts = () => {
    const API_URL = "http://localhost:9999/discounts";

    const [discounts, setDiscounts] = useState([]);
    const [search, setSearch] = useState("");
    const [filterActive, setFilterActive] = useState("All");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertType, setAlertType] = useState("success");

    const [form, setForm] = useState({
        name: "",
        code: "",
        amountPercentage: "",
        startDate: "",
        endDate: "",
        isActive: true,
    });

    // Fetch dữ liệu
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setDiscounts(data);
        } catch (err) {
            console.error(err);
            setAlertMsg("⚠️ Lỗi khi tải dữ liệu!");
            setAlertType("danger");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý alert tự tắt
    const showAlert = (msg, type = "success") => {
        setAlertMsg(msg);
        setAlertType(type);
        setTimeout(() => setAlertMsg(""), 2500);
    };

    // Filter + Search + Sort
    const filteredDiscounts = discounts
        .filter((d) => {
            const matchSearch =
                d.name.toLowerCase().includes(search.toLowerCase()) ||
                d.code.toLowerCase().includes(search.toLowerCase());
            const matchActive =
                filterActive === "All"
                    ? true
                    : filterActive === "true"
                        ? d.isActive
                        : !d.isActive;
            return matchSearch && matchActive;
        })
        .sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === "string") valA = valA.toLowerCase();
            if (typeof valB === "string") valB = valB.toLowerCase();
            if (valA < valB) return sortOrder === "asc" ? -1 : 1;
            if (valA > valB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    // Sort handler
    const handleSort = (field) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Open modal (add / edit)
    const openModal = (discount = null) => {
        if (discount) {
            setEditing(discount);
            setForm({ ...discount });
        } else {
            setEditing(null);
            setForm({
                name: "",
                code: "",
                amountPercentage: "",
                startDate: "",
                endDate: "",
                isActive: true,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    // Add or Edit discount
    const handleSave = async () => {
        const method = editing ? "PUT" : "POST";
        const url = editing ? `${API_URL}/${editing.id}` : API_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    amountPercentage: Number(form.amountPercentage),
                }),
            });

            if (!res.ok) throw new Error("Request failed");

            await fetchData();
            closeModal();
            showAlert(editing ? "✅ Cập nhật thành công!" : "🎉 Thêm thành công!");
        } catch (err) {
            showAlert("⚠️ Lỗi khi lưu!", "danger");
        }
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa discount này không?")) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            setDiscounts((prev) => prev.filter((d) => d.id !== id));
            showAlert("🗑️ Xóa thành công!");
        } catch (err) {
            showAlert("⚠️ Lỗi khi xóa!", "danger");
        }
    };

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading discounts...</p>
            </div>
        );

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-3">Manage Discounts</h2>

            {alertMsg && <Alert variant={alertType}>{alertMsg}</Alert>}

            {/* Search + Filter + Add */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-3">
                <InputGroup className="w-50">
                    <Form.Control
                        placeholder="Search by name or code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>

                <Form.Select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value)}
                    style={{ width: '200px' }}
                >
                    <option value="All">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </Form.Select>

                <Button style={{ width: '200px' }} variant="primary" onClick={() => openModal()}>
                    ➕ Add Discount
                </Button>
            </div>

            {/* Table */}
            <Table bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                            Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Code</th>
                        <th
                            onClick={() => handleSort("amountPercentage")}
                            style={{ cursor: "pointer" }}
                        >
                            Amount (%){" "}
                            {sortField === "amountPercentage" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th
                            onClick={() => handleSort("startDate")}
                            style={{ cursor: "pointer" }}
                        >
                            Start Date{" "}
                            {sortField === "startDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th
                            onClick={() => handleSort("endDate")}
                            style={{ cursor: "pointer" }}
                        >
                            End Date{" "}
                            {sortField === "endDate" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                        </th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredDiscounts.length > 0 ? (
                        filteredDiscounts.map((d) => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{d.code}</td>
                                <td>{d.amountPercentage}%</td>
                                <td>{d.startDate}</td>
                                <td>{d.endDate}</td>
                                <td
                                    className={
                                        d.isActive ? "text-success fw-semibold" : "text-secondary"
                                    }
                                >
                                    {d.isActive ? "Active" : "Inactive"}
                                </td>
                                <td>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openModal(d)}
                                    >
                                        ✏️ Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(d.id)}
                                    >
                                        🗑️ Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No discounts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal Add/Edit */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? "Edit Discount" : "Add Discount"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Code</Form.Label>
                            <Form.Control
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount (%)</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.amountPercentage}
                                onChange={(e) =>
                                    setForm({ ...form, amountPercentage: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Check
                            type="switch"
                            label="Active"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button style={{ width: '100px' }} variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageDiscounts;
