import React, { useState, useEffect } from 'react';

const ManageProduct = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [formData, setFormData] = useState({
        name: '',
        author: '',
        description: '',
        image: '',
        entrydate: '',
        price: '',
        quantity: '',
        categoryId: '',
        discountId: '',
        isHot: false
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:9999/products');
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:9999/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        let result = [...products];

        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            result = result.filter(product => product.categoryId.toString() === selectedCategory);
        }

        result.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'price' || sortBy === 'quantity') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else {
                aValue = aValue.toString().toLowerCase();
                bValue = bValue.toString().toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortBy, sortOrder, products]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleShowModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                author: '',
                description: '',
                image: '',
                entrydate: new Date().toISOString().split('T')[0],
                price: '',
                quantity: '',
                categoryId: '',
                discountId: '',
                isHot: false
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await fetch(`http://localhost:9999/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                alert('✅ Product updated successfully!');
            } else {
                // Get the last ID and increment
                const lastId = products.length > 0
                    ? Math.max(...products.map(p => parseInt(p.id)))
                    : 0;
                const newId = (lastId + 1).toString();

                await fetch('http://localhost:9999/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        id: newId
                    })
                });
                alert('✅ Product added successfully!');
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('❌ Error saving product. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await fetch(`http://localhost:9999/products/${id}`, {
                    method: 'DELETE'
                });
                alert('✅ Product deleted successfully!');
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('❌ Error deleting product. Please try again.');
            }
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id.toString() === categoryId.toString());
        return category ? category.name : 'N/A';
    };

    return (
        <div style={{ padding: '20px' }}>
            <style>{`
                .manage-products-container {
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
                    grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
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
                .badge {
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .badge-danger {
                    background: #dc3545;
                    color: white;
                    margin-left: 8px;
                }
                .badge-success {
                    background: #198754;
                    color: white;
                }
                .badge-secondary {
                    background: #6c757d;
                    color: white;
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
                    max-width: 700px;
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
                textarea.form-control {
                    resize: vertical;
                    min-height: 80px;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .form-row-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 16px;
                }
                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .checkbox-group input[type="checkbox"] {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
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
                .product-img {
                    width: 50px;
                    height: 70px;
                    object-fit: cover;
                    border-radius: 4px;
                }
            `}</style>

            <div className="manage-products-container">
                <div className="header-section">
                    <h2>Manage Products</h2>
                    <button style={{ width: '150px' }} className="btn btn-primary" onClick={() => handleShowModal()}>
                        <span>➕</span> Add Product
                    </button>
                </div>

                <div className="filters-section">
                    <div className="input-group">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="name">Sort by Name</option>
                            <option value="author">Sort by Author</option>
                            <option value="price">Sort by Price</option>
                            <option value="quantity">Sort by Quantity</option>
                            <option value="entrydate">Sort by Date</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">↑ Asc</option>
                            <option value="desc">↓ Desc</option>
                        </select>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>ID</th>
                                <th style={{ width: '80px' }}>Image</th>
                                <th>Name</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Status</th>
                                <th style={{ width: '140px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.id}</td>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-img"
                                        />
                                    </td>
                                    <td>
                                        {product.name}
                                        {product.isHot && (
                                            <span className="badge badge-danger">HOT</span>
                                        )}
                                    </td>
                                    <td>{product.author}</td>
                                    <td>{getCategoryName(product.categoryId)}</td>
                                    <td>{product.price.toLocaleString('vi-VN')}đ</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        <span className={`badge ${product.quantity > 0 ? 'badge-success' : 'badge-secondary'}`}>
                                            {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td style={{ width: '200px' }}>
                                        <button
                                            className="btn btn-sm btn-edit"
                                            onClick={() => handleShowModal(product)}
                                            style={{ marginRight: '8px' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-delete"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button
                                    onClick={handleCloseModal}
                                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Author *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Image URL *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-row-3">
                                    <div className="form-group">
                                        <label className="form-label">Price *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Quantity *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Entry Date *</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="entrydate"
                                            value={formData.entrydate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select
                                            className="form-control"
                                            name="categoryId"
                                            value={Number(formData.categoryId)}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Discount ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="discountId"
                                            value={Number(formData.discountId)}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="isHot"
                                            name="isHot"
                                            checked={formData.isHot}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="isHot" style={{ cursor: 'pointer' }}>Mark as Hot Product</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button style={{ width: '150px' }} className="btn btn-primary" onClick={handleSubmit}>
                                    {editingProduct ? 'Update' : 'Create'} Product
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProduct;