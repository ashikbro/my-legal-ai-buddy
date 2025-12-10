import React, { useState, useEffect } from 'react';
import { listTemplates, getTemplate, generateFromTemplate } from '../api';

function TemplateLibrary() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateData, setTemplateData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const result = await listTemplates();
      setTemplates(result.templates);
    } catch (err) {
      setError('Failed to load templates');
    }
  };

  const handleSelectTemplate = async (template) => {
    try {
      setLoading(true);
      setError(null);
      setGeneratedDocument(null);
      
      const result = await getTemplate(template.id);
      setSelectedTemplate(result);
      setTemplateData({});
      setLoading(false);
    } catch (err) {
      setError('Failed to load template details');
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setTemplateData({
      ...templateData,
      [key]: value
    });
  };

  const extractPlaceholders = (content) => {
    const regex = /\{\{(\w+)\}\}/g;
    const placeholders = new Set();
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      placeholders.add(match[1]);
    }
    
    return Array.from(placeholders);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await generateFromTemplate(selectedTemplate.id, templateData);
      setGeneratedDocument(result);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate document');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedDocument) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedDocument.document], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate.id}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBack = () => {
    setSelectedTemplate(null);
    setTemplateData({});
    setGeneratedDocument(null);
    setError(null);
  };

  const formatPlaceholderName = (placeholder) => {
    return placeholder
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (selectedTemplate) {
    const placeholders = extractPlaceholders(selectedTemplate.content);
    
    return (
      <div className="card">
        <button className="button button-secondary" onClick={handleBack}>
          ← Back to Templates
        </button>
        
        <h2>{selectedTemplate.name}</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>{selectedTemplate.description}</p>

        {!generatedDocument ? (
          <>
            <h3>Fill in the details:</h3>
            <div className="form-grid">
              {placeholders.map((placeholder) => (
                <div key={placeholder}>
                  <label>{formatPlaceholderName(placeholder)}:</label>
                  <input
                    type="text"
                    value={templateData[placeholder] || ''}
                    onChange={(e) => handleInputChange(placeholder, e.target.value)}
                    placeholder={`Enter ${formatPlaceholderName(placeholder).toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <button 
              className="button" 
              onClick={handleGenerate}
              disabled={loading}
            >
              📄 Generate Document
            </button>

            {error && (
              <div className="alert alert-error">
                <strong>Error:</strong> {error}
              </div>
            )}

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p style={{ marginTop: '20px', color: '#666' }}>Generating your document...</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="alert alert-success">
              ✅ Document generated successfully!
            </div>

            <div style={{ marginBottom: '20px' }}>
              <button className="button button-success" onClick={handleDownload}>
                💾 Download Document
              </button>
              <button className="button" onClick={() => setGeneratedDocument(null)}>
                ✏️ Edit Details
              </button>
            </div>

            <div className="result-section">
              <h3>Generated Document:</h3>
              <div className="result-content" style={{ 
                background: 'white', 
                padding: '20px', 
                border: '1px solid #ddd',
                maxHeight: '500px',
                overflow: 'auto'
              }}>
                {generatedDocument.document}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📋 Template Library</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Choose from our collection of customizable legal document templates. Fill in your details and generate professional documents instantly.
      </p>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading templates...</p>
        </div>
      ) : (
        <div className="template-grid">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="template-card"
              onClick={() => handleSelectTemplate(template)}
            >
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <span className="template-category">{template.category}</span>
            </div>
          ))}
        </div>
      )}

      {templates.length === 0 && !loading && (
        <div className="alert alert-info">
          No templates available. Please check back later.
        </div>
      )}
    </div>
  );
}

export default TemplateLibrary;
