import React, { useState } from 'react';
import {
  analyzeDocument,
  summarizeDocument,
  identifyRisks,
  suggestImprovements,
  uploadDocument
} from '../api';

function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [summary, setSummary] = useState(null);
  const [risks, setRisks] = useState(null);
  const [improvements, setImprovements] = useState(null);
  const [error, setError] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError(null);
      setLoading(true);
      
      // Upload file
      const uploadResult = await uploadDocument(file);
      
      // Read file content for analysis (if text file)
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentText(e.target.result);
        };
        reader.readAsText(file);
      }
      
      alert('File uploaded successfully! You can now analyze it by pasting the content below.');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError('Please enter or upload document text');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setActiveAnalysis('analysis');
      
      const result = await analyzeDocument(documentText);
      setAnalysis(result);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze document');
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!documentText.trim()) {
      setError('Please enter or upload document text');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setActiveAnalysis('summary');
      
      const result = await summarizeDocument(documentText);
      setSummary(result.summary);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to summarize document');
      setLoading(false);
    }
  };

  const handleIdentifyRisks = async () => {
    if (!documentText.trim()) {
      setError('Please enter or upload document text');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setActiveAnalysis('risks');
      
      const result = await identifyRisks(documentText);
      setRisks(result.risks);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to identify risks');
      setLoading(false);
    }
  };

  const handleSuggestImprovements = async () => {
    if (!documentText.trim()) {
      setError('Please enter or upload document text');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setActiveAnalysis('improvements');
      
      const result = await suggestImprovements(documentText);
      setImprovements(result.suggestions);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to suggest improvements');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDocumentText('');
    setAnalysis(null);
    setSummary(null);
    setRisks(null);
    setImprovements(null);
    setError(null);
    setActiveAnalysis(null);
  };

  return (
    <div className="card">
      <h2>📄 Document Analysis</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Upload or paste a legal document to get AI-powered analysis, plain language summaries, risk identification, and improvement suggestions.
      </p>

      {/* File Upload */}
      <div className="file-upload" onClick={() => document.getElementById('file-input').click()}>
        <input
          id="file-input"
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileUpload}
        />
        <p>📁 Click to upload a document</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          Supported formats: TXT, PDF, DOC, DOCX (max 16MB)
        </p>
      </div>

      {/* Text Input */}
      <div style={{ marginTop: '20px' }}>
        <label>Or paste document text here:</label>
        <textarea
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder="Paste your legal document text here..."
        />
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '20px' }}>
        <button className="button" onClick={handleAnalyze} disabled={loading}>
          🔍 Analyze Document
        </button>
        <button className="button" onClick={handleSummarize} disabled={loading}>
          📝 Generate Summary
        </button>
        <button className="button" onClick={handleIdentifyRisks} disabled={loading}>
          ⚠️ Identify Risks
        </button>
        <button className="button" onClick={handleSuggestImprovements} disabled={loading}>
          💡 Suggest Improvements
        </button>
        <button className="button button-secondary" onClick={handleClear}>
          🗑️ Clear
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Processing your document...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && activeAnalysis === 'analysis' && (
        <div className="result-section">
          <h3>📊 Document Analysis</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <h4>Basic Statistics</h4>
            <p>Word Count: <strong>{analysis.word_count}</strong></p>
            <p>Character Count: <strong>{analysis.character_count}</strong></p>
          </div>

          {analysis.complexity_score && (
            <div style={{ marginBottom: '20px' }}>
              <h4>Complexity Analysis</h4>
              <p>Complexity Score: <strong>{analysis.complexity_score.score}/100</strong></p>
              <p>Level: <strong>{analysis.complexity_score.complexity_level}</strong></p>
              <p>Avg Sentence Length: <strong>{analysis.complexity_score.average_sentence_length} words</strong></p>
            </div>
          )}

          {analysis.key_terms && analysis.key_terms.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4>Key Legal Terms</h4>
              <ul>
                {analysis.key_terms.map((term, idx) => (
                  <li key={idx}>
                    <strong>{term.term}</strong> (mentioned {term.count} times)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.entities && analysis.entities.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4>Named Entities</h4>
              <ul>
                {analysis.entities.slice(0, 10).map((entity, idx) => (
                  <li key={idx}>
                    <strong>{entity.text}</strong> ({entity.label})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.sections && analysis.sections.length > 0 && (
            <div>
              <h4>Document Sections</h4>
              <ul>
                {analysis.sections.map((section, idx) => (
                  <li key={idx}>{section.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {summary && activeAnalysis === 'summary' && (
        <div className="result-section">
          <h3>📝 Plain Language Summary</h3>
          <div className="result-content">{summary}</div>
        </div>
      )}

      {/* Risks */}
      {risks && activeAnalysis === 'risks' && (
        <div className="result-section">
          <h3>⚠️ Risk Analysis</h3>
          {risks.map((risk, idx) => (
            <div key={idx} className={`risk-item risk-${risk.severity}`}>
              <span className={`severity severity-${risk.severity}`}>
                {risk.severity.toUpperCase()}
              </span>
              <h4>{risk.risk}</h4>
              <p>{risk.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Improvements */}
      {improvements && activeAnalysis === 'improvements' && (
        <div className="result-section">
          <h3>💡 Improvement Suggestions</h3>
          {improvements.map((suggestion, idx) => (
            <div key={idx} className="risk-item risk-low" style={{ borderColor: '#667eea' }}>
              <span className="severity" style={{ background: '#667eea', color: 'white' }}>
                {suggestion.priority.toUpperCase()}
              </span>
              <h4>{suggestion.suggestion}</h4>
              <p><strong>Category:</strong> {suggestion.category}</p>
              <p>{suggestion.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentAnalyzer;
