import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Badge } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../api/client';

const AdminAnalysis = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [predictionInput, setPredictionInput] = useState({
        employees: 100,
        accidents: 0,
        training_hours: 50
    });
    const [predictionResult, setPredictionResult] = useState(null);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        try {
            const response = await client.get('/admin/analysis');
            setAnalysisData(response.data);
        } catch (error) {
            console.error("Error fetching analysis:", error);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        try {
            const response = await client.post('/predict', predictionInput);
            setPredictionResult(response.data);
        } catch (error) {
            console.error("Error predicting:", error);
        }
    };

    // Prepare chart data if available
    const chartData = analysisData?.accidents_by_year
        ? Object.entries(analysisData.accidents_by_year).map(([year, acc]) => ({ name: year, Accidents: acc }))
        : [];

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ minHeight: '80vh', marginTop: '80px' }}>
                <h2 className="mb-4">AI Analysis & Prediction</h2>

                <Row className="mb-5">
                    <Col md={8}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Accident Trends (Yearly)</Card.Title>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Accidents" fill="#F94A00" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 shadow-sm">
                            <Card.Body>
                                <Card.Title>Key Insights</Card.Title>
                                {analysisData ? (
                                    <ul className="list-unstyled mt-3">
                                        <li className="mb-3">
                                            <strong>Compliance Correlation:</strong><br />
                                            <Badge bg="info">{analysisData.correlation_compliance_accidents?.toFixed(2) || "N/A"}</Badge>
                                            <small className="d-block text-muted">Correlation between compliance scores and accidents.</small>
                                        </li>
                                        <li>
                                            <strong>Dept. Performance:</strong>
                                            <div className="mt-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {analysisData.department_performance && Object.entries(analysisData.department_performance).map(([dept, metrics]) => (
                                                    <div key={dept} className="mb-2 border-bottom pb-1">
                                                        <strong>{dept}</strong>: {metrics.accidents?.toFixed(1)} avg accidents
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    </ul>
                                ) : <p>Loading insights...</p>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Prediction Section */}
                <Card className="shadow">
                    <Card.Header as="h4" className="bg-primary text-white">AI Risk Predictor</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form onSubmit={handlePredict}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Number of Employees</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={predictionInput.employees}
                                            onChange={(e) => setPredictionInput({ ...predictionInput, employees: parseInt(e.target.value) })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Past Accidents (Last Year)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={predictionInput.accidents}
                                            onChange={(e) => setPredictionInput({ ...predictionInput, accidents: parseInt(e.target.value) })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Training Hours (Total)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={predictionInput.training_hours}
                                            onChange={(e) => setPredictionInput({ ...predictionInput, training_hours: parseInt(e.target.value) })}
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit">Predict Risk</Button>
                                </Form>
                            </Col>

                            <Col md={6} className="d-flex align-items-center justify-content-center">
                                {predictionResult && (
                                    <div className="text-center">
                                        <h4>Predicted Risk Score</h4>
                                        <div className="display-1 fw-bold" style={{ color: predictionResult.risk_score > 50 ? 'red' : 'green' }}>
                                            {predictionResult.risk_score}
                                        </div>
                                        <h5>
                                            <Badge bg={predictionResult.classification === 'High' ? 'danger' : 'success'}>
                                                {predictionResult.classification} Risk
                                            </Badge>
                                        </h5>
                                        <p className="mt-3 lead">{predictionResult.recommendation}</p>
                                    </div>
                                )}
                                {!predictionResult && <div className="text-muted">Enter parameters to get prediction</div>}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default AdminAnalysis;
