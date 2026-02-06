import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';

const CertificateVerification = () => {
    const [searchParams] = useSearchParams();
    const certIdFromUrl = searchParams.get('id');
    const [certId, setCertId] = useState(certIdFromUrl || '');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setResult(null);

        try {
            // Need a new public endpoint in backend logically, but for now using the authenticated list is blocked.
            // We need to add a public endpoint first.
            // Let's assume we implement /public/verify/{cert_id} in backend next.
            const res = await apiClient.get(`/public/verify/${certId}`);
            setResult(res.data);
        } catch (err) {
            setError('Certificate not found or invalid.');
        }
    };

    useEffect(() => {
        if (certIdFromUrl) {
            handleVerify();
        }
    }, [certIdFromUrl]);

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1>🛡️ IOSH Certificate Verification</h1>
            <p>Enter the Certificate ID to verify its authenticity.</p>

            <form onSubmit={handleVerify} style={{ marginTop: '20px' }}>
                <input
                    type="text"
                    value={certId}
                    onChange={e => setCertId(e.target.value)}
                    placeholder="Enter Certificate ID (e.g. MED-001)"
                    style={{ padding: '10px', width: '70%', fontSize: '16px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
                    Verify
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

            {result && (
                <div style={{ marginTop: '30px', padding: '20px', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#f0fff4' }}>
                    <h2 style={{ color: '#28a745' }}>✅ Valid Certificate</h2>
                    <p><strong>ID:</strong> {result.cert_id}</p>
                    <p><strong>Type:</strong> {result.type.toUpperCase()}</p>
                    <p><strong>Issued To:</strong> {result.owner_email}</p>
                    <p><strong>Expiry Date:</strong> {new Date(result.expiry_date).toDateString()}</p>
                    <p><strong>Status:</strong> {result.status.toUpperCase()}</p>
                </div>
            )}
        </div>
    );
};

export default CertificateVerification;
