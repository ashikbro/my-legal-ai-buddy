import React, { useState } from 'react';
import './index.css';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import TemplateLibrary from './components/TemplateLibrary';
import DocumentStorage from './components/DocumentStorage';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>⚖️ Legal AI Buddy</h1>
          <p>Your Personal Legal Assistant - Analyze Contracts, Generate Templates & Store Documents Securely</p>
          
          <div className="nav">
            <button 
              className={`nav-button ${activeTab === 'analyze' ? 'active' : ''}`}
              onClick={() => setActiveTab('analyze')}
            >
              📄 Analyze Documents
            </button>
            <button 
              className={`nav-button ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              📋 Template Library
            </button>
            <button 
              className={`nav-button ${activeTab === 'storage' ? 'active' : ''}`}
              onClick={() => setActiveTab('storage')}
            >
              💾 Document Storage
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {activeTab === 'analyze' && <DocumentAnalyzer />}
        {activeTab === 'templates' && <TemplateLibrary />}
        {activeTab === 'storage' && <DocumentStorage />}
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
        <p>⚠️ Disclaimer: This tool provides general information only and is not a substitute for professional legal advice.</p>
        <p style={{ marginTop: '10px' }}>© 2024 Legal AI Buddy - Built with React, Flask, spaCy & OpenAI</p>
      </footer>
    </div>
  );
}

export default App;
