# Legal AI Buddy - Quick Start Guide

## Quick Start (Development)

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install Flask flask-cors

# Optional: Install AI/NLP features
pip install spacy openai
python -m spacy download en_core_web_sm

# Run the server
python run.py
```

Backend will run on: http://localhost:5000

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: http://localhost:3000

## Testing the Application

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# List templates
curl http://localhost:5000/api/templates

# Analyze text
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "Your contract text here..."}'

# Identify risks
curl -X POST http://localhost:5000/api/risks \
  -H "Content-Type: application/json" \
  -d '{"text": "Your contract text here..."}'
```

## Features to Try

1. **Document Analysis**
   - Upload or paste a contract
   - Click "Analyze Document" for structure analysis
   - Click "Generate Summary" for plain language summary
   - Click "Identify Risks" to detect potential issues
   - Click "Suggest Improvements" for recommendations

2. **Template Library**
   - Browse 5 professional templates
   - Select a template (NDA, Rental, etc.)
   - Fill in your details
   - Generate and download your document

3. **Document Storage**
   - Upload documents securely
   - View all stored documents
   - Download or delete files

## Without AI Dependencies

The app works without spaCy or OpenAI installed, using basic text analysis:
- Word and character counts
- Key term extraction
- Risk keyword detection
- Basic complexity metrics

## With Full AI Features

Install optional dependencies for enhanced features:

```bash
pip install spacy openai
python -m spacy download en_core_web_sm
```

Add OpenAI API key to `.env`:
```
OPENAI_API_KEY=your-api-key-here
```

This enables:
- Advanced named entity recognition
- AI-powered summaries
- Intelligent risk analysis
- Smart improvement suggestions

## Production Deployment

For production:

1. Set environment variables in `.env`
2. Use a production WSGI server (gunicorn, uWSGI)
3. Enable HTTPS
4. Set strong SECRET_KEY
5. Configure CORS properly
6. Add rate limiting
7. Implement authentication

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## Troubleshooting

### Backend won't start
- Check Python version (3.8+)
- Install Flask: `pip install Flask flask-cors`
- Check port 5000 is not in use

### Frontend won't start
- Check Node.js version (14+)
- Run `npm install` in frontend directory
- Check port 3000 is not in use

### API calls fail
- Ensure backend is running on port 5000
- Check CORS settings
- Verify API_URL in frontend

### No AI features
- Install spaCy: `pip install spacy`
- Download model: `python -m spacy download en_core_web_sm`
- For OpenAI: Add API key to `.env`

## Support

For issues or questions, please open an issue on GitHub.
