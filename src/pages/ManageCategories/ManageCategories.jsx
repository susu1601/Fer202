import React, { useState, useEffect } from 'react';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:9999/categories');
            const data = await response.json();
            setCategories(data);
            setFilteredCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        let result = [...categories];

        if (searchTerm) {
            result = result.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOrder === 'id') {
            result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        } else if (sortOrder === 'asc') {
            result.sort((a, b) => {
                const aValue = a.name.toLowerCase();
                const bValue = b.name.toLowerCase();
                return aValue > bValue ? 1 : -1;
            });
        } else if (sortOrder === 'desc') {
            result.sort((a, b) => {
                const aValue = a.name.toLowerCase();
                const bValue = b.name.toLowerCase();
                return aValue < bValue ? 1 : -1;
            });
        }

        setFilteredCategories(result);
        setCurrentPage(1);
    }, [searchTerm, sortOrder, categories]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handleShowModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name });
        } else {
            setEditingCategory(null);
            setFormData({ name: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('⚠️ Category name cannot be empty!');
            return;
        }

        // Check for duplicate category name
        const normalizedNewName = formData.name.trim().toLowerCase();
        const isDuplicate = categories.some(cat => {
            // Skip checking against itself when editing
            if (editingCategory && cat.id === editingCategory.id) {
                return false;
            }
            return cat.name.toLowerCase() === normalizedNewName;
        });

        if (isDuplicate) {
            alert('⚠️ Category name already exists! Please choose a different name.');
            return;
        }

        try {
            if (editingCategory) {
                await fetch(`http://localhost:9999/categories/${editingCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.name.trim() })
                });
                alert('✅ Category updated successfully!');
            } else {
                const lastId = categories.length > 0
                    ? Math.max(...categories.map(c => parseInt(c.id)))
                    : 0;
                const newId = (lastId + 1).toString();

                await fetch('http://localhost:9999/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: newId,
                        name: formData.name.trim()
                    })
                });
                alert('✅ Category added successfully!');
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('❌ Error saving category. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await fetch(`http://localhost:9999/categories/${id}`, {
                    method: 'DELETE'
                });
                alert('✅ Category deleted successfully!');
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('❌ Error deleting category. Please try again.');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <style>{`
                .manage-categories-container {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                }
                .header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .filters-section {
                    display: grid;
                    grid-template-columns: 3fr 1fr;
                    gap: 15px;
                    margin-bottom: 25px;
                }
                .input-group {
                    display: flex;
                    align-items: center;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    padding: 8px 12px;
                    background: white;
                }
                .input-group input, .input-group select {
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 14px;
                    padding: 4px;
                }
                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .btn-primary {
                    background: #0d6efd;
                    color: white;
                }
                .btn-primary:hover {
                    background: #0b5ed7;
                }
                .btn-sm {
                    padding: 6px 12px;
                    font-size: 13px;
                }
                .btn-edit {
                    background: #0d6efd;
                    color: white;
                }
                .btn-edit:hover {
                    background: #0b5ed7;
                }
                .btn-delete {
                    background: #dc3545;
                    color: white;
                }
                .btn-delete:hover {
                    background: #bb2d3b;
                }
                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }
                .btn-secondary:hover {
                    background: #5c636a;
                }
                .table-container {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th {
                    background: #f8f9fa;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 14px;
                    color: #495057;
                    border-bottom: 2px solid #dee2e6;
                }
                td {
                    padding: 12px;
                    border-bottom: 1px solid #dee2e6;
                    font-size: 14px;
                }
                tr:hover {
                    background: #f8f9fa;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body {
                    padding: 24px;
                }
                .modal-footer {
                    padding: 16px 24px;
                    border-top: 1px solid #dee2e6;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    font-size: 14px;
                    color: #212529;
                }
                .form-control {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                }
                .form-control:focus {
                    border-color: #86b7fe;
                    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
                .page-btn {
                    padding: 8px 12px;
                    border: 1px solid #dee2e6;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    min-width: 40px;
                }
                .page-btn:hover:not(:disabled) {
                    background: #e9ecef;
                }
                .page-btn.active {
                    background: #0d6efd;
                    color: white;
                    border-color: #0d6efd;
                }
                .page-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .stats-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .stats-card h3 {
                    margin: 0;
                    font-size: 32px;
                    font-weight: 700;
                }
                .stats-card p {
                    margin: 5px 0 0 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
            `}</style>

            <div className="manage-categories-container">
                <div className="header-section">
                    <h2>Manage Categories</h2>
                    <button style={{ width: "150px" }} className="btn btn-primary" onClick={() => handleShowModal()}>
                        <span>➕</span> Add Category
                    </button>
                </div>

                <div className="stats-card">
                    <h3>{categories.length}</h3>
                    <p>Total Categories</p>
                </div>

                <div className="filters-section">
                    <div className="input-group">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="id">Sort by ID</option>
                            <option value="asc">↑ A-Z</option>
                            <option value="desc">↓ Z-A</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '100px' }}>ID</th>
                                <th>Category Name</th>
                                <th style={{ width: '200px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories.length > 0 ? (
                                currentCategories.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.id}</td>
                                        <td>{category.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-edit"
                                                onClick={() => handleShowModal(category)}
                                                style={{ marginRight: '8px' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-delete"
                                                onClick={() => handleDelete(category.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                                        No categories found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                            ⏮️
                        </button>
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ◀️
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                className={`page-btn ${index + 1 === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ▶️
                        </button>
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            ⏭️
                        </button>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                                <button
                                    onClick={handleCloseModal}
                                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Category Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter category name..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button style={{ width: '140px' }} className="btn btn-primary" onClick={handleSubmit}>
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCategories;