# ⚖️ Legal AI Buddy

A comprehensive personal legal assistant app that leverages AI to analyze contracts, generate summaries, identify risks, and provide customizable legal document templates.

## 🌟 Features

### 📄 Document Analysis
- **Contract Summarization**: Generate plain language summaries of complex legal documents
- **Risk Identification**: Automatically detect potential risks and problematic clauses
- **Improvement Suggestions**: Get recommendations for missing clauses and document improvements
- **NLP Analysis**: Extract key terms, named entities, and document structure using spaCy
- **Complexity Analysis**: Assess document readability and complexity metrics

### 📋 Template Library
- Pre-built legal document templates:
  - Non-Disclosure Agreements (NDA)
  - Rental Agreements
  - Employment Contracts
  - Service Agreements
  - Consulting Agreements
- Customizable placeholders for personalization
- Instant document generation with your data
- Download generated documents

### 💾 Document Storage
- Secure document upload and storage
- File management (view, download, delete)
- Support for multiple formats (TXT, PDF, DOC, DOCX)
- Document metadata tracking

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework for REST API
- **spaCy**: Natural Language Processing for text analysis
- **OpenAI GPT**: Advanced AI-powered summarization and analysis (optional)
- **Flask-CORS**: Cross-origin resource sharing support

### Frontend
- **React**: Modern UI library
- **Axios**: HTTP client for API communication
- **CSS3**: Responsive and modern styling

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy language model:
```bash
python -m spacy download en_core_web_sm
```

5. Set up environment variables:
```bash
cp ../.env.example .env
# Edit .env and add your configuration
```

6. Run the Flask server:
```bash
python run.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔑 Configuration

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
# Flask Backend
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# OpenAI API (Optional)
OPENAI_API_KEY=your-openai-api-key

# React Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### OpenAI Integration (Optional)

For enhanced AI features:
1. Sign up at https://openai.com/
2. Get your API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

The app works without OpenAI API key using basic NLP analysis.

## 🚀 Usage

### Analyzing Documents

1. Click on **"Analyze Documents"** tab
2. Upload a document or paste text
3. Choose an action:
   - **Analyze Document**: Get comprehensive analysis with key terms, entities, and structure
   - **Generate Summary**: Get a plain language summary
   - **Identify Risks**: Detect potential risks and problematic clauses
   - **Suggest Improvements**: Get recommendations for missing or weak clauses

### Using Templates

1. Click on **"Template Library"** tab
2. Browse available templates
3. Select a template
4. Fill in the required information
5. Generate and download your customized document

### Managing Documents

1. Click on **"Document Storage"** tab
2. Upload documents for secure storage
3. View, download, or delete stored documents

## 📁 Project Structure

```
my-legal-ai-buddy/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # Flask app factory
│   │   ├── routes.py         # API endpoints
│   │   └── services.py       # Business logic and AI integration
│   ├── templates/            # Legal document templates
│   │   ├── nda.txt
│   │   ├── rental_agreement.txt
│   │   ├── employment_contract.txt
│   │   ├── service_agreement.txt
│   │   └── consulting_agreement.txt
│   ├── uploads/              # Document storage
│   ├── requirements.txt      # Python dependencies
│   └── run.py               # Application entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentAnalyzer.js
│   │   │   ├── TemplateLibrary.js
│   │   │   └── DocumentStorage.js
│   │   ├── App.js
│   │   ├── api.js           # API client
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔒 Security Considerations

- Always use HTTPS in production
- Set strong `SECRET_KEY` in production
- Implement user authentication for multi-user deployment
- Consider encrypting sensitive documents at rest
- Regular security audits for uploaded files
- Implement rate limiting for API endpoints
- Validate and sanitize all user inputs
- Keep dependencies updated

## 📝 API Endpoints

### Document Analysis
- `POST /api/analyze` - Analyze document structure and content
- `POST /api/summarize` - Generate plain language summary
- `POST /api/risks` - Identify potential risks
- `POST /api/improvements` - Suggest improvements

### Templates
- `GET /api/templates` - List available templates
- `GET /api/templates/:type` - Get specific template
- `POST /api/templates/:type/generate` - Generate document from template

### Document Management
- `POST /api/upload` - Upload document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Download document
- `DELETE /api/documents/:id` - Delete document

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This tool provides general information and analysis only. It is **NOT** a substitute for professional legal advice. Always consult with a qualified attorney for legal matters.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React, Flask, spaCy, and OpenAI GPT

## 🔮 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Database integration for persistent storage
- [ ] Advanced document comparison features
- [ ] Email notifications for document analysis
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Integration with e-signature services
- [ ] Advanced AI features with GPT-4
- [ ] Document version control
- [ ] Collaborative document editing
