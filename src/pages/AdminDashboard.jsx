import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../api/client';

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
            <Container className="py-5" style={{ minHeight: '80vh', marginTop: '80px' }}>
                <h2 className="mb-4">Admin Dashboard</h2>

                {/* Stats Row */}
                <Row className="mb-5">
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Total Users</Card.Title>
                                <h3>{stats.total_users}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Total Certificates</Card.Title>
                                <h3>{stats.total_certs}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Active Certificates</Card.Title>
                                <h3>{stats.active_certs}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Revenue (LKR)</Card.Title>
                                <h3>{stats.revenue.toLocaleString()}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Links */}
                <h4 className="mb-3">Management Tools</h4>
                <Row>
                    <Col md={4} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Upload Data</Card.Title>
                                <Card.Text>
                                    Upload bulk historical data (CSV/Excel) for analysis and AI training.
                                </Card.Text>
                                <Link to="/admin/upload">
                                    <Button variant="primary">Go to Upload</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Certificate Management</Card.Title>
                                <Card.Text>
                                    Issue new certificates and manage existing validities.
                                </Card.Text>
                                <Link to="/admin/certificates">
                                    <Button variant="primary">Manage Certificates</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>AI Analysis & Prediction</Card.Title>
                                <Card.Text>
                                    View insights from historical data and predict future risks.
                                </Card.Text>
                                <Link to="/admin/analysis">
                                    <Button variant="primary">View Analysis</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default AdminDashboard;
