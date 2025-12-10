import React, { useState, useEffect } from 'react';
import { listDocuments, deleteDocument, downloadDocument, uploadDocument } from '../api';

function DocumentStorage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await listDocuments();
      setDocuments(result.documents);
      setLoading(false);
    } catch (err) {
      setError('Failed to load documents');
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError(null);
      setSuccessMessage(null);
      setLoading(true);
      
      await uploadDocument(file);
      setSuccessMessage('Document uploaded successfully!');
      
      // Reload documents list
      await loadDocuments();
      
      // Clear file input
      event.target.value = '';
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload document');
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);
      
      await deleteDocument(documentId);
      setSuccessMessage('Document deleted successfully!');
      
      // Reload documents list
      await loadDocuments();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handleDownload = (documentId) => {
    downloadDocument(documentId);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="card">
      <h2>💾 Document Storage</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Securely store and manage your legal documents. Upload new documents or access previously stored files.
      </p>

      {/* Upload Section */}
      <div className="file-upload" onClick={() => document.getElementById('storage-file-input').click()}>
        <input
          id="storage-file-input"
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleUpload}
        />
        <p>📁 Click to upload a document</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          Supported formats: TXT, PDF, DOC, DOCX (max 16MB)
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          ✅ {successMessage}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Processing...</p>
        </div>
      )}

      {/* Documents List */}
      <div style={{ marginTop: '30px' }}>
        <h3>Your Documents ({documents.length})</h3>
        
        {documents.length === 0 && !loading ? (
          <div className="alert alert-info">
            No documents stored yet. Upload your first document above!
          </div>
        ) : (
          <ul className="document-list">
            {documents.map((doc) => (
              <li key={doc.filename} className="document-item">
                <div className="document-info">
                  <h4>📄 {doc.filename}</h4>
                  <div className="document-meta">
                    <span>Size: {formatFileSize(doc.size)}</span>
                    <span style={{ marginLeft: '20px' }}>
                      Modified: {formatDate(doc.modified)}
                    </span>
                  </div>
                </div>
                <div className="document-actions">
                  <button 
                    className="button button-success"
                    onClick={() => handleDownload(doc.filename)}
                  >
                    📥 Download
                  </button>
                  <button 
                    className="button button-danger"
                    onClick={() => handleDelete(doc.filename)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Security Notice */}
      <div className="alert alert-info" style={{ marginTop: '30px' }}>
        <strong>🔒 Security Notice:</strong> Your documents are stored securely on the server. 
        Always ensure you're using HTTPS in production and consider additional encryption for sensitive documents.
      </div>
    </div>
  );
}

export default DocumentStorage;
