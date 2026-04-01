import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import client from '../api/client';

const AdminUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage(null);
        setError(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await client.post('/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(`Success: ${response.data.message} (${response.data.rows_processed} rows).`);
            setFile(null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Container className="py-5" style={{ minHeight: '80vh', marginTop: '80px', maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">Upload Historical Data</h2>
                <Card className="shadow">
                    <Card.Body>
                        <Card.Text>
                            Upload CSV or Excel files containing historical safety data.
                            The AI model will automatically retrain upon successful upload.
                        </Card.Text>

                        <Form onSubmit={handleUpload}>
                            <Form.Group controlId="formFile" className="mb-4">
                                <Form.Label>Select File (.csv, .xlsx)</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
                            </Form.Group>

                            {uploading && <ProgressBar animated now={100} label="Uploading & Processing..." className="mb-3" />}

                            {message && <Alert variant="success">{message}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit" disabled={!file || uploading}>
                                    {uploading ? 'Processing...' : 'Upload Data'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default AdminUpload;
