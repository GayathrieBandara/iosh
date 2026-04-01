import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge, Spinner, Alert, Form, InputGroup } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../api/client';
import '../styles/AdminUsers.css';
import { FaUser, FaCertificate, FaHistory, FaSearch, FaEnvelope, FaIdBadge, FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Profile Modal state
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userProfileLoading, setUserProfileLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    // CRUD Modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [formData, setFormData] = useState({
        id: null,
        full_name: '',
        email: '',
        role: 'member',
        password: ''
    });
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    // Delete Modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await client.get('/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users from database.");
            setLoading(false);
        }
    };

    const handleCloseProfile = () => {
        setShowProfileModal(false);
        setUserProfile(null);
    };

    const handleShowProfile = async (userId) => {
        setShowProfileModal(true);
        setUserProfileLoading(true);
        try {
            const response = await client.get(`/admin/users/${userId}`);
            setUserProfile(response.data);
            setUserProfileLoading(false);
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setUserProfileLoading(false);
        }
    };

    // CRUD Handlers
    const handleShowAdd = () => {
        setModalMode('add');
        setFormData({ id: null, full_name: '', email: '', role: 'member', password: '' });
        setFormError(null);
        setFormSuccess(null);
        setShowEditModal(true);
    };

    const handleShowEdit = (user) => {
        setModalMode('edit');
        setFormData({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            password: '' // Password not loaded for security
        });
        setFormError(null);
        setFormSuccess(null);
        setShowEditModal(true);
    };

    const handleCloseEdit = () => setShowEditModal(false);

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            if (modalMode === 'add') {
                if (!formData.password) {
                    setFormError("Password is required for new users.");
                    return;
                }
                await client.post('/admin/users', {
                    full_name: formData.full_name,
                    email: formData.email,
                    role: formData.role,
                    password: formData.password
                });
                setFormSuccess("User created successfully!");
            } else {
                await client.put(`/admin/users/${formData.id}`, {
                    full_name: formData.full_name,
                    email: formData.email,
                    role: formData.role
                });
                setFormSuccess("User updated successfully!");
            }
            fetchUsers(); // Refresh list
            setTimeout(() => {
                handleCloseEdit();
                setFormSuccess(null);
            }, 1000);
        } catch (err) {
            console.error("Error saving user:", err);
            setFormError(err.response?.data?.detail || "Failed to save user.");
        }
    };

    const handleShowDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await client.delete(`/admin/users/${userToDelete.id}`);
            fetchUsers();
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-wrapper" style={{ minHeight: '80vh', padding: '40px 0', backgroundColor: '#f0f2f5' }}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h2 className="fw-bold" style={{ color: '#0E5B5E' }}>Customer Management</h2>
                            <p className="text-muted">Manage your member base, view certifications, and update profiles.</p>
                        </div>
                        <div>
                            <Button variant="outline-dark" className="me-2" onClick={() => window.history.back()}>Dashboard</Button>
                            <Button variant="success" onClick={handleShowAdd}><FaPlus className="me-1" /> Add User</Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <Card className="mb-5 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <Card.Body className="p-4">
                            <InputGroup className="mb-0">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <FaSearch className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search customers by name or email..."
                                    className="border-start-0 shadow-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '1.1rem' }}
                                />
                            </InputGroup>
                        </Card.Body>
                    </Card>

                    {error && <Alert variant="danger">{error}</Alert>}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="grow" variant="primary" />
                        </div>
                    ) : (
                        <Row>
                            {filteredUsers.map(user => (
                                <Col lg={4} md={6} sm={12} key={user.id} className="mb-4">
                                    <Card className="h-100 border-0 shadow-sm user-card" style={{ borderRadius: '15px', transition: 'transform 0.2s', overflow: 'hidden' }}>
                                        <div className="card-header border-0 bg-transparent text-end pt-3 pe-3 pb-0">
                                            <Button variant="link" className="text-secondary p-0 me-2" onClick={() => handleShowEdit(user)}><FaEdit /></Button>
                                            <Button variant="link" className="text-danger p-0" onClick={() => handleShowDelete(user)}><FaTrash /></Button>
                                        </div>
                                        <Card.Body className="d-flex flex-column align-items-center text-center p-4 pt-0">
                                            <div className="mb-3 position-relative">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-inner"
                                                    style={{ width: '80px', height: '80px', backgroundColor: '#e2e8f0', color: '#0E5B5E', fontSize: '2rem' }}>
                                                    {user.full_name.charAt(0).toUpperCase()}
                                                </div>
                                                <Badge bg={user.role === 'admin' ? 'danger' : 'success'}
                                                    className="position-absolute bottom-0 end-0 rounded-circle p-2 border border-white">
                                                    <span className="visually-hidden">{user.role}</span>
                                                </Badge>
                                            </div>

                                            <Card.Title className="fw-bold mb-1">{user.full_name}</Card.Title>
                                            <div className="text-muted small mb-3">
                                                <FaEnvelope className="me-1" /> {user.email}
                                            </div>

                                            <div className="w-100 mt-auto pt-3 border-top">
                                                <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                                                    <span>User ID: #{user.id}</span>
                                                    <span>
                                                        <FaCertificate className="me-1 text-warning" />
                                                        {user.certificate_count} Certs
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline-primary"
                                                    className="w-100 rounded-pill"
                                                    onClick={() => handleShowProfile(user.id)}
                                                >
                                                    View Profile & History
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                            {filteredUsers.length === 0 && (
                                <Col xs={12} className="text-center py-5 text-muted">
                                    <h4>No customers found matching your search.</h4>
                                </Col>
                            )}
                        </Row>
                    )}
                </Container>
            </div>

            {/* User Profile Modal */}
            <Modal show={showProfileModal} onHide={handleCloseProfile} size="lg" centered contentClassName="border-0 shadow-lg">
                <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
                <Modal.Body className="px-5 pb-5 pt-0">
                    {userProfileLoading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : userProfile ? (
                        <div>
                            <div className="text-center mb-4">
                                <div className="mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                    style={{ width: '100px', height: '100px', backgroundColor: '#f8f9fa', color: '#0E5B5E', fontSize: '2.5rem' }}>
                                    {userProfile.user.full_name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="fw-bold">{userProfile.user.full_name}</h3>
                                <p className="text-muted"><FaEnvelope className="me-1" /> {userProfile.user.email}</p>
                                <Badge bg={userProfile.user.role === 'admin' ? 'danger' : 'success'} className="px-3 py-2 rounded-pill">
                                    {userProfile.user.role.toUpperCase()}
                                </Badge>
                            </div>
                            <Card className="border-0 bg-light rounded-3 mb-4">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <FaHistory className="me-2 text-primary" />
                                        <h5 className="mb-0 fw-bold">Certificate History</h5>
                                    </div>
                                    {userProfile.certificates.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-borderless mb-0">
                                                <thead className="text-muted border-bottom">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Type</th>
                                                        <th>Issued</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {userProfile.certificates.map(cert => (
                                                        <tr key={cert.id} className="align-middle">
                                                            <td className="font-monospace text-primary fw-bold">{cert.cert_id}</td>
                                                            <td>{cert.type}</td>
                                                            <td>{new Date(cert.issue_date).toLocaleDateString()}</td>
                                                            <td><Badge bg={cert.status === 'active' ? 'success' : 'secondary'}>{cert.status}</Badge></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted">
                                            <FaCertificate className="mb-2" size={24} />
                                            <p>No certificates found for this user.</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <Alert variant="danger">Failed to load profile.</Alert>
                    )}
                </Modal.Body>
            </Modal>

            {/* Add/Edit User Modal */}
            <Modal show={showEditModal} onHide={handleCloseEdit} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === 'add' ? 'Add New User' : 'Edit User'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSaveUser}>
                    <Modal.Body>
                        {formError && <Alert variant="danger">{formError}</Alert>}
                        {formSuccess && <Alert variant="success">{formSuccess}</Alert>}

                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>
                        {modalMode === 'add' && (
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </Form.Group>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEdit}>Cancel</Button>
                        <Button variant="primary" type="submit">{modalMode === 'add' ? 'Create User' : 'Save Changes'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <FaExclamationTriangle className="text-warning mb-3" size={40} />
                        <p>Are you sure you want to delete <strong>{userToDelete?.full_name}</strong>?</p>
                        <p className="text-muted small">This action cannot be undone. All associated certificates may be affected.</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete User</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default AdminUsers;
