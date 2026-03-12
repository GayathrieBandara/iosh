import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AdminAnalysis.css';

// Separate axios client for the Python AI API
const aiClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
});

const PIE_COLORS = ['#388e3c', '#fbc02d', '#d32f2f'];
const BAR_GRADIENT_COLORS = ['#1976d2', '#7b1fa2', '#c2185b', '#388e3c', '#0097a7', '#ef6c00', '#d32f2f'];

const AdminAnalysis = () => {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [sectorData, setSectorData] = useState([]);
    const [districtData, setDistrictData] = useState([]);
    const [riskDist, setRiskDist] = useState([]);
    const [envData, setEnvData] = useState([]);
    const [predicting, setPredicting] = useState(false);
    const [predictionResult, setPredictionResult] = useState(null);

    const [predictionInput, setPredictionInput] = useState({
        noise_level_db: 80,
        dust_level_mg: 2.5,
        chemical_exposure_ppm: 0.15,
        temperature_c: 30,
        humidity_percent: 65,
        employee_age: 35,
        bmi: 25,
        respiratory_issue: 0,
        non_compliance_flag: 0,
        sector: 'Manufacturing',
        district: 'Colombo',
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [analysisRes, sectorRes, districtRes, riskRes, envRes] = await Promise.all([
                aiClient.get('/api/analysis'),
                aiClient.get('/api/analytics/sector'),
                aiClient.get('/api/analytics/district'),
                aiClient.get('/api/analytics/risk-distribution'),
                aiClient.get('/api/analytics/environmental'),
            ]);
            setAnalysis(analysisRes.data);
            setSectorData(sectorRes.data);
            setDistrictData(districtRes.data);
            setRiskDist(riskRes.data);
            setEnvData(envRes.data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setPredicting(true);
        setPredictionResult(null);
        try {
            const res = await aiClient.post('/api/predict', predictionInput);
            setPredictionResult(res.data);
        } catch (err) {
            console.error('Prediction error:', err);
        } finally {
            setPredicting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setPredictionInput(prev => ({ ...prev, [field]: value }));
    };

    // Prepare radar chart data from environmental analytics
    const radarData = envData.map(e => ({
        sector: e.sector,
        Noise: e.avg_noise_db,
        Dust: e.avg_dust_mg * 20, // scale up for visibility
        Chemical: e.avg_chemical_ppm * 500,
        Temperature: e.avg_temperature_c,
        Humidity: e.avg_humidity_pct,
    }));

    // Feature importance sorted
    const importanceSorted = analysis?.feature_importance
        ? Object.entries(analysis.feature_importance)
            .sort((a, b) => b[1] - a[1])
        : [];

    const maxImportance = importanceSorted.length > 0 ? importanceSorted[0][1] : 1;

    const chartTooltipStyle = {
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        color: '#333',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="analysis-page">
                    <div className="loading-container">
                        <div className="spinner" />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="analysis-page">
                <Container>
                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="page-title">AI Analytics Dashboard</h1>
                        <p className="page-subtitle">
                            Powered by Machine Learning — Real-time insights from {analysis?.total_members?.toLocaleString()} member records
                        </p>
                        <div className="d-flex gap-2 flex-wrap">
                            <span className="model-badge">🎯 {analysis?.model_accuracy}% System Confidence</span>
                            <span className="model-badge">🛡️ Compliance Verified</span>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <Row className="g-3 mb-4">
                        <Col xs={6} lg={3}>
                            <div className="light-card stat-card">
                                <div className="stat-icon blue">👥</div>
                                <div className="stat-value">{analysis?.total_members?.toLocaleString()}</div>
                                <div className="stat-label">Total Members</div>
                            </div>
                        </Col>
                        <Col xs={6} lg={3}>
                            <div className="light-card stat-card">
                                <div className="stat-icon orange">📈</div>
                                <div className="stat-value">{analysis?.avg_risk_score}</div>
                                <div className="stat-label">Avg Risk Score</div>
                            </div>
                        </Col>
                        <Col xs={6} lg={3}>
                            <div className="light-card stat-card">
                                <div className="stat-icon red">🔴</div>
                                <div className="stat-value">{analysis?.high_risk_percentage}%</div>
                                <div className="stat-label">High Risk</div>
                            </div>
                        </Col>
                        <Col xs={6} lg={3}>
                            <div className="light-card stat-card">
                                <div className="stat-icon green">✅</div>
                                <div className="stat-value">{analysis?.compliance_rate}%</div>
                                <div className="stat-label">Compliance Rate</div>
                            </div>
                        </Col>
                    </Row>

                    {/* Charts Row 1: Sector + Risk Distribution */}
                    <Row className="g-3 mb-4">
                        <Col lg={8}>
                            <div className="light-card">
                                <h5 className="section-title">Risk Score by Sector</h5>
                                <p className="section-subtitle">Average risk scores across industry sectors</p>
                                <div className="chart-container mt-3">
                                    <ResponsiveContainer>
                                        <BarChart data={sectorData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="sector" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={chartTooltipStyle} />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="avg_risk_score" fill="#1976d2" name="Avg Risk" radius={[6, 6, 0, 0]} />
                                            <Bar dataKey="max_risk_score" fill="#d32f2f" name="Max Risk" radius={[6, 6, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="light-card">
                                <h5 className="section-title">Risk Distribution</h5>
                                <p className="section-subtitle">Members by risk category</p>
                                <div className="chart-container mt-3">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={riskDist}
                                                dataKey="count"
                                                nameKey="label"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                innerRadius={60}
                                                paddingAngle={5}
                                                stroke="none"
                                                label={({ label, count }) => `${label}: ${count}`}
                                            >
                                                {riskDist.map((entry, idx) => (
                                                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={chartTooltipStyle} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Charts Row 2: District + Environmental Radar */}
                    <Row className="g-3 mb-4">
                        <Col lg={6}>
                            <div className="light-card">
                                <h5 className="section-title">Risk Score by District</h5>
                                <p className="section-subtitle">Geographic risk distribution</p>
                                <div className="chart-container mt-3">
                                    <ResponsiveContainer>
                                        <BarChart data={districtData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                            <XAxis type="number" axisLine={false} tickLine={false} />
                                            <YAxis dataKey="district" type="category" width={90} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={chartTooltipStyle} />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="avg_risk_score" fill="#7b1fa2" name="Avg Risk" radius={[0, 6, 6, 0]} />
                                            <Bar dataKey="member_count" fill="#0097a7" name="Members" radius={[0, 6, 6, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="light-card">
                                <h5 className="section-title">Environmental Trends</h5>
                                <p className="section-subtitle">Comparison of environmental metrics by sector</p>
                                <div className="chart-container mt-3">
                                    <ResponsiveContainer>
                                        <RadarChart data={radarData}>
                                            <PolarGrid stroke="#eee" />
                                            <PolarAngleAxis dataKey="sector" />
                                            <PolarRadiusAxis angle={30} axisLine={false} />
                                            <Radar name="Noise" dataKey="Noise" stroke="#1976d2" fill="#1976d2" fillOpacity={0.2} />
                                            <Radar name="Temperature" dataKey="Temperature" stroke="#d32f2f" fill="#d32f2f" fillOpacity={0.2} />
                                            <Radar name="Humidity" dataKey="Humidity" stroke="#388e3c" fill="#388e3c" fillOpacity={0.15} />
                                            <Tooltip contentStyle={chartTooltipStyle} />
                                            <Legend iconType="circle" />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Feature Importance */}
                    <Row className="g-3 mb-4">
                        <Col lg={12}>
                            <div className="light-card">
                                <h5 className="section-title">Primary Risk Drivers</h5>
                                <p className="section-subtitle">The most significant factors influencing workspace safety risk scores</p>
                                <div className="mt-3">
                                    {importanceSorted.map(([name, value]) => (
                                        <div className="importance-item" key={name}>
                                            <span className="importance-name">{name.replace(/_/g, ' ')}</span>
                                            <div className="importance-bar-bg">
                                                <div
                                                    className="importance-bar-fill"
                                                    style={{ width: `${(value / maxImportance) * 100}%` }}
                                                />
                                            </div>
                                            <span className="importance-val">{(value * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* AI Prediction Panel */}
                    <div className="prediction-panel mb-4" id="predict">
                        <Row>
                            <Col lg={12} className="mb-3">
                                <h4 className="section-title" style={{ fontSize: '1.6rem' }}>🤖 AI Risk Predictor</h4>
                                <p className="section-subtitle">Enter workplace parameters to predict the risk classification using our trained ML model</p>
                            </Col>
                        </Row>
                        <Form onSubmit={handlePredict}>
                            <Row className="g-3">
                                {/* Environmental Inputs */}
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Noise Level (dB)</Form.Label>
                                        <Form.Control
                                            type="number" step="0.1"
                                            value={predictionInput.noise_level_db}
                                            onChange={e => handleInputChange('noise_level_db', parseFloat(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Dust Level (mg/m³)</Form.Label>
                                        <Form.Control
                                            type="number" step="0.01"
                                            value={predictionInput.dust_level_mg}
                                            onChange={e => handleInputChange('dust_level_mg', parseFloat(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Chemical Exposure (ppm)</Form.Label>
                                        <Form.Control
                                            type="number" step="0.001"
                                            value={predictionInput.chemical_exposure_ppm}
                                            onChange={e => handleInputChange('chemical_exposure_ppm', parseFloat(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Temperature (°C)</Form.Label>
                                        <Form.Control
                                            type="number" step="0.1"
                                            value={predictionInput.temperature_c}
                                            onChange={e => handleInputChange('temperature_c', parseFloat(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Humidity (%)</Form.Label>
                                        <Form.Control
                                            type="number" step="0.1"
                                            value={predictionInput.humidity_percent}
                                            onChange={e => handleInputChange('humidity_percent', parseFloat(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Health Inputs */}
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Employee Age</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={predictionInput.employee_age}
                                            onChange={e => handleInputChange('employee_age', parseInt(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>BMI</Form.Label>
                                        <Form.Control
                                            type="number" step="0.1"
                                            value={predictionInput.bmi}
                                            onChange={e => handleInputChange('bmi', parseFloat(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Respiratory Issue</Form.Label>
                                        <Form.Select
                                            value={predictionInput.respiratory_issue}
                                            onChange={e => handleInputChange('respiratory_issue', parseInt(e.target.value))}
                                        >
                                            <option value={0}>No</option>
                                            <option value={1}>Yes</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Non-Compliance Flag</Form.Label>
                                        <Form.Select
                                            value={predictionInput.non_compliance_flag}
                                            onChange={e => handleInputChange('non_compliance_flag', parseInt(e.target.value))}
                                        >
                                            <option value={0}>Compliant</option>
                                            <option value={1}>Non-Compliant</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {/* Sector & District */}
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>Sector</Form.Label>
                                        <Form.Select
                                            value={predictionInput.sector}
                                            onChange={e => handleInputChange('sector', e.target.value)}
                                        >
                                            {['Agriculture', 'Construction', 'Fisheries', 'Healthcare', 'Logistics', 'Manufacturing'].map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4} lg={3}>
                                    <Form.Group>
                                        <Form.Label>District</Form.Label>
                                        <Form.Select
                                            value={predictionInput.district}
                                            onChange={e => handleInputChange('district', e.target.value)}
                                        >
                                            {['Colombo', 'Galle', 'Gampaha', 'Jaffna', 'Kandy', 'Kurunegala'].map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} className="mt-4">
                                    <Button type="submit" className="btn-predict" disabled={predicting}>
                                        {predicting ? 'Analyzing...' : '🔍 Predict Risk'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>

                        {/* Prediction Result */}
                        {predictionResult && (
                            <div className="prediction-result mt-5">
                                <Row className="g-4">
                                    <Col md={4} className="text-center">
                                        <div className={`risk-badge ${predictionResult.risk_label.toLowerCase()}`}>
                                            {predictionResult.risk_label} Risk
                                        </div>
                                        <div className="risk-score-display">{predictionResult.risk_score}</div>
                                        <div className="stat-label">Predicted Risk Score</div>
                                    </Col>
                                    <Col md={4}>
                                        <h6 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '16px', fontWeight: 700 }}>
                                            Confidence Breakdown
                                        </h6>
                                        {predictionResult.confidence && Object.entries(predictionResult.confidence).map(([label, pct]) => (
                                            <div key={label} style={{ marginBottom: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span style={{ color: '#777', fontSize: '0.85rem' }}>{label}</span>
                                                    <span style={{ color: '#333', fontSize: '0.85rem', fontWeight: 700 }}>{pct}%</span>
                                                </div>
                                                <div className="confidence-bar">
                                                    <div
                                                        className={`confidence-bar-fill ${label.toLowerCase()}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Col>
                                    <Col md={4}>
                                        <div className="recommendation-box">
                                            <strong style={{ color: '#0E5B5E', fontSize: '0.95rem', display: 'block', marginBottom: '8px' }}>Recommendation</strong>
                                            <p style={{ margin: 0 }}>{predictionResult.recommendation}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    );
};

export default AdminAnalysis;
