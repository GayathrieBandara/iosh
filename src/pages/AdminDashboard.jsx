import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaCertificate, FaCheckCircle, FaMoneyBillWave, FaCloudUploadAlt, FaChartLine, FaCogs } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../api/client';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total_users: 0,
        total_certs: 0,
        active_certs: 0,
        revenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await client.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-wrapper">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="dashboard-header">Admin Dashboard</h2>
                        <p className="lead text-muted">Manage your institute's safety certifications and data insights.</p>
                    </div>

                    {/* Stats Row */}
                    <Row className="mb-5">
                        <Col md={3} sm={6}>
                            <Card className="stat-card users">
                                <Card.Body>
                                    <div>
                                        <Card.Title>Total Users</Card.Title>
                                        <h3>{stats.total_users}</h3>
                                    </div>
                                    <FaUsers className="stat-icon" />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6}>
                            <Card className="stat-card certs">
                                <Card.Body>
                                    <div>
                                        <Card.Title>Issued Certs</Card.Title>
                                        <h3>{stats.total_certs}</h3>
                                    </div>
                                    <FaCertificate className="stat-icon" />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6}>
                            <Card className="stat-card active">
                                <Card.Body>
                                    <div>
                                        <Card.Title>Active Valid</Card.Title>
                                        <h3>{stats.active_certs}</h3>
                                    </div>
                                    <FaCheckCircle className="stat-icon" />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} sm={6}>
                            <Card className="stat-card revenue">
                                <Card.Body>
                                    <div>
                                        <Card.Title>Revenue</Card.Title>
                                        <h3>Rs. {stats.revenue.toLocaleString()}</h3>
                                    </div>
                                    <FaMoneyBillWave className="stat-icon" />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Feature Section */}
                    <h4 className="mb-4 text-center text-uppercase fw-bold" style={{ color: '#0E5B5E' }}>Management Tools</h4>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="feature-card shadow">
                                <Card.Body>
                                    <div className="feature-icon-wrapper">
                                        <FaCloudUploadAlt />
                                    </div>
                                    <Card.Title>Upload Data</Card.Title>
                                    <Card.Text>
                                        Bulk upload historical safety data (CSV/Excel) to retrain the AI model and update records.
                                    </Card.Text>
                                    <Link to="/admin/upload">
                                        <Button variant="outline-primary" className="btn-feature">Upload Now</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="feature-card shadow">
                                <Card.Body>
                                    <div className="feature-icon-wrapper">
                                        <FaCogs />
                                    </div>
                                    <Card.Title>Manage Certificates</Card.Title>
                                    <Card.Text>
                                        Issue new safety certificates, verify existing ones, and manage expirations.
                                    </Card.Text>
                                    <Link to="/admin/certificates">
                                        <Button variant="outline-success" className="btn-feature">Manage Certs</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="feature-card shadow">
                                <Card.Body>
                                    <div className="feature-icon-wrapper">
                                        <FaChartLine />
                                    </div>
                                    <Card.Title>AI Insights</Card.Title>
                                    <Card.Text>
                                        Analyze trends, view risk predictions, and get AI-driven safety recommendations.
                                    </Card.Text>
                                    <Link to="/admin/analysis">
                                        <Button variant="outline-danger" className="btn-feature">View Analysis</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;
