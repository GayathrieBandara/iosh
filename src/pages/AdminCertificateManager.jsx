import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

const AdminCertificateManager = () => {
    const [certificates, setCertificates] = useState([]);
    const [formData, setFormData] = useState({
        cert_id: '',
        type: 'medical',
        expiry_date: '',
        owner_email: ''
    });
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await apiClient.get('/certificates/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCertificates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await apiClient.post('/certificates/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Certificate Created Successfully!');
            fetchCertificates();
            setFormData({ cert_id: '', type: 'medical', expiry_date: '', owner_email: '' });
        } catch (err) {
            setMsg('Error creating certificate. Check email or inputs.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/dashboard')}>&larr; Back to Dashboard</button>
            <h1>Certificate Management</h1>

            <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h3>Issue New Certificate</h3>
                {msg && <p style={{ color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
                <form onSubmit={handleCreate} style={{ display: 'grid', gap: '10px', maxWidth: '400px' }}>
                    <input
                        type="text" placeholder="Certificate ID (e.g., MED-001)"
                        value={formData.cert_id} onChange={e => setFormData({ ...formData, cert_id: e.target.value })} required
                    />
                    <input
                        type="email" placeholder="Owner Email"
                        value={formData.owner_email} onChange={e => setFormData({ ...formData, owner_email: e.target.value })} required
                    />
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                        <option value="medical">Medical</option>
                        <option value="environmental">Environmental</option>
                        <option value="professional">Professional</option>
                    </select>
                    <input
                        type="date"
                        value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} required
                    />
                    <button type="submit">Issue Certificate</button>
                </form>
            </div>

            <h3>Issued Certificates</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Expiry</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.map(cert => (
                        <tr key={cert.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{cert.cert_id}</td>
                            <td>{cert.type}</td>
                            <td>{cert.status}</td>
                            <td>{new Date(cert.expiry_date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCertificateManager;
