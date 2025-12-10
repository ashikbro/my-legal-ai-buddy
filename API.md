# API Documentation

Base URL: `http://localhost:5000/api`

## Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "message": "Legal AI Buddy is running"
}
```

---

### Document Analysis

**POST** `/analyze`

Analyze a legal document's structure and content.

**Request Body:**
```json
{
  "text": "Your document text here..."
}
```

**Response:**
```json
{
  "word_count": 150,
  "character_count": 890,
  "complexity_score": {
    "score": 45.2,
    "average_sentence_length": 18.5,
    "complexity_level": "Medium"
  },
  "key_terms": [
    {"term": "agreement", "count": 5},
    {"term": "party", "count": 8}
  ],
  "entities": [
    {"text": "John Doe", "label": "PERSON", "start": 10, "end": 18}
  ],
  "sections": [
    {"title": "1. DEFINITIONS", "position": 100}
  ]
}
```

---

### Document Summarization

**POST** `/summarize`

Generate a plain language summary of a legal document.

**Request Body:**
```json
{
  "text": "Your document text here..."
}
```

**Response:**
```json
{
  "summary": "This document is a legal agreement between two parties..."
}
```

---

### Risk Identification

**POST** `/risks`

Identify potential risks in a legal document.

**Request Body:**
```json
{
  "text": "Your document text here..."
}
```

**Response:**
```json
{
  "risks": [
    {
      "risk": "Unlimited Liability",
      "severity": "high",
      "description": "Document may contain unlimited liability provisions",
      "found": true
    },
    {
      "risk": "Indemnification Obligations",
      "severity": "medium",
      "description": "Contains indemnification clauses that may create liability",
      "found": true
    }
  ]
}
```

**Severity Levels:**
- `high`: Critical risks that require immediate attention
- `medium`: Important risks that should be reviewed
- `low`: Minor issues or informational items

---

### Improvement Suggestions

**POST** `/improvements`

Get suggestions for improving a legal document.

**Request Body:**
```json
{
  "text": "Your document text here..."
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "category": "Missing Clause",
      "suggestion": "Add Termination Clause",
      "description": "Include clear termination conditions and notice periods",
      "priority": "high"
    },
    {
      "category": "Readability",
      "suggestion": "Simplify Language",
      "description": "Document has high complexity. Consider using simpler language",
      "priority": "medium"
    }
  ]
}
```

**Priority Levels:**
- `high`: Essential improvements
- `medium`: Recommended improvements
- `low`: Optional enhancements

---

### Template Management

**GET** `/templates`

List all available document templates.

**Response:**
```json
{
  "templates": [
    {
      "id": "nda",
      "name": "Non-Disclosure Agreement (NDA)",
      "description": "Standard NDA for protecting confidential information",
      "category": "Confidentiality"
    },
    {
      "id": "rental_agreement",
      "name": "Rental Agreement",
      "description": "Residential property rental/lease agreement",
      "category": "Real Estate"
    }
  ]
}
```

---

**GET** `/templates/:type`

Get details of a specific template.

**Parameters:**
- `type` (path): Template ID (e.g., "nda", "rental_agreement")

**Response:**
```json
{
  "id": "nda",
  "name": "Non-Disclosure Agreement (NDA)",
  "description": "Standard NDA for protecting confidential information",
  "category": "Confidentiality",
  "content": "NON-DISCLOSURE AGREEMENT\n\nThis Agreement..."
}
```

---

**POST** `/templates/:type/generate`

Generate a document from a template with custom data.

**Parameters:**
- `type` (path): Template ID

**Request Body:**
```json
{
  "date": "December 10, 2024",
  "party1_name": "John Doe",
  "party1_address": "123 Main St",
  "party2_name": "Jane Smith",
  "party2_address": "456 Oak Ave",
  "purpose": "Software Development Project",
  "duration": "2",
  "jurisdiction": "California"
}
```

**Response:**
```json
{
  "document": "NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement...",
  "template_type": "nda",
  "metadata": {
    "generated_at": "2024-12-10T00:00:00.000000",
    "template_name": "Non-Disclosure Agreement (NDA)"
  }
}
```

---

### Document Storage

**POST** `/upload`

Upload a document for storage.

**Request:** Multipart form data
- `file`: Document file (TXT, PDF, DOC, DOCX)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "document_id": "20241210_120000_document.txt",
  "metadata": {
    "filename": "20241210_120000_document.txt",
    "original_filename": "document.txt",
    "upload_date": "20241210_120000",
    "filepath": "/path/to/uploads/20241210_120000_document.txt"
  }
}
```

---

**GET** `/documents`

List all uploaded documents.

**Response:**
```json
{
  "documents": [
    {
      "filename": "20241210_120000_document.txt",
      "size": 1024,
      "modified": "2024-12-10T12:00:00.000000"
    }
  ]
}
```

---

**GET** `/documents/:id`

Download a specific document.

**Parameters:**
- `id` (path): Document ID (filename)

**Response:** File download

---

**DELETE** `/documents/:id`

Delete a specific document.

**Parameters:**
- `id` (path): Document ID (filename)

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `201`: Created (for uploads)
- `400`: Bad Request (missing or invalid parameters)
- `404`: Not Found (document or template not found)
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Rate Limiting

Currently, there is no rate limiting. In production, implement rate limiting to prevent abuse.

---

## Authentication

Currently, there is no authentication. For production use with sensitive documents, implement:
- User authentication (JWT, OAuth, etc.)
- Document ownership and access control
- API key authentication

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

## File Size Limits

- Maximum upload size: 16 MB
- Supported formats: TXT, PDF, DOC, DOCX

---

## Dependencies

### Optional AI Features

The following features require additional packages:

**spaCy** (for enhanced NLP):
- Named entity recognition
- Advanced text analysis

**OpenAI** (for GPT-powered features):
- AI-generated summaries
- Intelligent risk analysis
- Smart improvement suggestions

Without these packages, the API falls back to basic text analysis.
