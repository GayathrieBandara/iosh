import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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

    const featureCards = [
        {
            icon: <FaUsers />,
            title: 'Manage Users',
            desc: 'View all registered customers, their profiles, and certificate history.',
            link: '/admin/users',
            btnText: 'View Customers'
        },
        {
            icon: <FaCloudUploadAlt />,
            title: 'Upload Data',
            desc: 'Bulk upload historical safety data (CSV/Excel) to retrain the AI model.',
            link: '/admin/upload',
            btnText: 'Upload Now'
        },
        {
            icon: <FaCogs />,
            title: 'Manage Certs',
            desc: 'Issue new safety certificates, verify existing ones, and manage expirations.',
            link: '/admin/certificates',
            btnText: 'Manage Certs'
        },
        {
            icon: <FaChartLine />,
            title: 'AI Insights',
            desc: 'Analyze trends, view risk predictions, and get AI-driven safety recommendations.',
            link: '/admin/analysis',
            btnText: 'View Analysis'
        }
    ];

    return (
        <>
            <Navbar />
            <div className="admin-dashboard-wrapper">
                <Container>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                        <div>
                            <h2 className="dashboard-header">Admin Dashboard</h2>
                            <p className="dashboard-subtitle">Manage your institute's safety certifications and data insights.</p>
                        </div>
                        <Link to="/login">
                            <button className="btn-logout-light" onClick={() => localStorage.removeItem('token')}>
                                ✦ Logout
                            </button>
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="stats-grid">
                        <div className="light-card stat-card">
                            <div className="stat-icon-wrapper blue">
                                <FaUsers />
                            </div>
                            <div className="stat-value">{stats.total_users}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                        <div className="light-card stat-card">
                            <div className="stat-icon-wrapper green">
                                <FaCertificate />
                            </div>
                            <div className="stat-value">{stats.total_certs}</div>
                            <div className="stat-label">Issued Certs</div>
                        </div>
                        <div className="light-card stat-card">
                            <div className="stat-icon-wrapper orange">
                                <FaCheckCircle />
                            </div>
                            <div className="stat-value">{stats.active_certs}</div>
                            <div className="stat-label">Active Valid</div>
                        </div>
                        <div className="light-card stat-card">
                            <div className="stat-icon-wrapper teal">
                                <FaMoneyBillWave />
                            </div>
                            <div className="stat-value">Rs. {stats.revenue.toLocaleString()}</div>
                            <div className="stat-label">Revenue</div>
                        </div>
                    </div>

                    {/* Management Tools Section */}
                    <div style={{ marginTop: '56px' }}>
                        <div className="text-center mb-5">
                            <h4 className="section-title">Management Tools</h4>
                            <p className="section-subtitle">Quick access to admin features</p>
                        </div>
                        <Row>
                            {featureCards.map((card, index) => (
                                <Col md={3} sm={6} className="mb-4" key={index}>
                                    <div className="light-card feature-card-light">
                                        <div className="feature-icon-wrapper">
                                            {card.icon}
                                        </div>
                                        <h5 className="feature-title-light">{card.title}</h5>
                                        <p className="feature-desc-light">{card.desc}</p>
                                        <Link to={card.link}>
                                            <button className="btn-feature-light">
                                                {card.btnText}
                                            </button>
                                        </Link>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default AdminDashboard;
