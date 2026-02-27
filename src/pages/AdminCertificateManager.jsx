import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge, Spinner, Alert, Form, InputGroup, Table } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../api/client';
import { FaCertificate, FaPlus, FaTrash, FaSearch, FaCalendarAlt, FaEnvelope, FaIdCard, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminCertificateManager = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [msg, setMsg] = useState('');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [certToDelete, setCertToDelete] = useState(null);

    const [formData, setFormData] = useState({
        certId: '',
        type: 'medical',
        expiryDate: '',
        ownerEmail: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const res = await client.get('/api/certificates');
            setCertificates(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch certificates from the server.');
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            await client.post('/api/certificates', {
                certId: formData.certId,
                type: formData.type,
                expiryDate: new Date(formData.expiryDate).toISOString(),
                ownerEmail: formData.ownerEmail,
                status: 'active'
            });
            setMsg('Certificate issued successfully!');
            fetchCertificates();
            setFormData({ certId: '', type: 'medical', expiryDate: '', ownerEmail: '' });
            setTimeout(() => {
                setShowAddModal(false);
                setMsg('');
            }, 1000);
        } catch (err) {
            console.error(err);
            setMsg('Error issuing certificate. Please check all fields.');
        }
    };

    const handleDelete = async () => {
        if (!certToDelete) return;
        try {
            await client.delete(`/api/certificates/${certToDelete.id}`);
            fetchCertificates();
            setShowDeleteModal(false);
            setCertToDelete(null);
        } catch (err) {
            console.error(err);
            alert('Failed to delete certificate.');
        }
    };

    const filteredCertificates = certificates.filter(cert =>
        cert.certId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return <Badge bg="success" className="rounded-pill"><FaCheckCircle className="me-1" /> Active</Badge>;
            case 'expired': return <Badge bg="danger" className="rounded-pill"><FaExclamationTriangle className="me-1" /> Expired</Badge>;
            case 'pending': return <Badge bg="warning" className="rounded-pill text-dark"><FaClock className="me-1" /> Pending</Badge>;
            default: return <Badge bg="secondary" className="rounded-pill">{status}</Badge>;
        }
    };

    return (
        <>
            <Navbar />
            <div className="admin-page-wrapper" style={{ minHeight: '90vh', backgroundColor: '#f8fafc', padding: '40px 0' }}>
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h2 className="fw-bold" style={{ color: '#0f172a' }}>Certificate Management</h2>
                            <p className="text-muted">Issue, track, and manage all professional certifications.</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-dark" onClick={() => navigate('/admin/dashboard')}>Dashboard</Button>
                            <Button variant="primary" onClick={() => setShowAddModal(true)} className="d-flex align-items-center gap-2 shadow-sm">
                                <FaPlus /> Issue Certificate
                            </Button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <Row className="mb-5">
                        <Col md={4}>
                            <Card className="border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #0f172a, #1e293b)', borderRadius: '15px' }}>
                                <Card.Body className="p-4 d-flex align-items-center">
                                    <div className="p-3 rounded-circle bg-white bg-opacity-10 me-4">
                                        <FaCertificate size={24} />
                                    </div>
                                    <div>
                                        <div className="text-white text-opacity-75 small">Total Issued</div>
                                        <div className="h3 fw-bold mb-0">{certificates.length}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <Card.Body className="p-4 d-flex align-items-center">
                                    <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success me-4">
                                        <FaCheckCircle size={24} />
                                    </div>
                                    <div>
                                        <div className="text-muted small">Active Pass</div>
                                        <div className="h3 fw-bold mb-0 text-dark">{certificates.filter(c => c.status === 'active').length}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                <Card.Body className="p-4 d-flex align-items-center">
                                    <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger me-4">
                                        <FaExclamationTriangle size={24} />
                                    </div>
                                    <div>
                                        <div className="text-muted small">Expired / Near Expiry</div>
                                        <div className="h3 fw-bold mb-0 text-dark">{certificates.filter(c => new Date(c.expiryDate) < new Date()).length}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Search and Table */}
                    <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
                        <Card.Header className="bg-white p-4 border-0">
                            <InputGroup className="bg-light rounded-pill px-3 py-1">
                                <InputGroup.Text className="bg-transparent border-0">
                                    <FaSearch className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search by ID, Email, or Type..."
                                    className="bg-transparent border-0 shadow-none py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2 text-muted">Loading certificates...</p>
                                </div>
                            ) : error ? (
                                <Alert variant="danger" className="m-4">{error}</Alert>
                            ) : (
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="bg-light text-muted small text-uppercase fw-bold">
                                        <tr>
                                            <th className="ps-4 py-3">Certificate ID</th>
                                            <th>Owner / Email</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Issue Date</th>
                                            <th>Expiry Date</th>
                                            <th className="pe-4 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCertificates.map(cert => (
                                            <tr key={cert.id}>
                                                <td className="ps-4 py-3 fw-bold text-primary">{cert.certId}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="p-2 rounded bg-light me-2"><FaEnvelope className="text-muted" size={12} /></div>
                                                        {cert.ownerEmail}
                                                    </div>
                                                </td>
                                                <td><Badge bg="light" text="dark" className="border px-3 py-2 text-capitalize">{cert.type}</Badge></td>
                                                <td>{getStatusBadge(cert.status)}</td>
                                                <td>
                                                    <div className="d-flex align-items-center text-muted small">
                                                        <FaCalendarAlt className="me-2" />
                                                        {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center text-muted small">
                                                        <FaCalendarAlt className="me-2" />
                                                        {new Date(cert.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <Button variant="link" className="text-danger p-0" onClick={() => { setCertToDelete(cert); setShowDeleteModal(true); }}>
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredCertificates.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-5 text-muted">
                                                    <div className="mb-2"><FaCertificate size={40} className="text-light" /></div>
                                                    No certificates found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Container>
            </div>

            {/* Issue Certificate Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="md">
                <Modal.Header closeButton className="border-0 px-4 pt-4">
                    <Modal.Title className="fw-bold">Issue New Certificate</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreate}>
                    <Modal.Body className="px-4 pb-4">
                        {msg && <Alert variant={msg.includes('Error') ? 'danger' : 'success'}>{msg}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-uppercase text-muted">Certificate Identifier</Form.Label>
                            <InputGroup className="bg-light rounded">
                                <InputGroup.Text className="bg-transparent border-0"><FaIdCard className="text-muted" /></InputGroup.Text>
                                <Form.Control
                                    className="bg-transparent border-0 py-2 shadow-none"
                                    placeholder="e.g. MED-2024-001"
                                    value={formData.certId}
                                    onChange={e => setFormData({ ...formData, certId: e.target.value })}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-uppercase text-muted">Owner Email Address</Form.Label>
                            <InputGroup className="bg-light rounded">
                                <InputGroup.Text className="bg-transparent border-0"><FaEnvelope className="text-muted" /></InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    className="bg-transparent border-0 py-2 shadow-none"
                                    placeholder="user@example.com"
                                    value={formData.ownerEmail}
                                    onChange={e => setFormData({ ...formData, ownerEmail: e.target.value })}
                                    required
                                />
                            </InputGroup>
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-uppercase text-muted">Category</Form.Label>
                                    <Form.Select
                                        className="bg-light border-0 py-2 shadow-none"
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="medical">Medical</option>
                                        <option value="environmental">Environmental</option>
                                        <option value="professional">Professional</option>
                                        <option value="technical">Technical</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-uppercase text-muted">Expiry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="bg-light border-0 py-2 shadow-none"
                                        value={formData.expiryDate}
                                        onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button type="submit" variant="primary" className="w-100 py-3 mt-3 rounded-pill fw-bold shadow-sm">
                            Generate & Issue Certificate
                        </Button>
                    </Modal.Body>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <FaExclamationTriangle className="text-danger mb-3" size={40} />
                    <h5 className="fw-bold">Confirm Deletion</h5>
                    <p className="text-muted small">Are you sure you want to revoke this certificate? This action cannot be undone.</p>
                    <div className="d-grid gap-2">
                        <Button variant="danger" onClick={handleDelete} className="rounded-pill">Delete Permanently</Button>
                        <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
};

export default AdminCertificateManager;
