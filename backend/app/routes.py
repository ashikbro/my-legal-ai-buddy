from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
import json
from datetime import datetime
from app.services import (
    analyze_contract,
    summarize_document,
    identify_risks,
    suggest_improvements,
    get_template,
    list_templates
)

api_bp = Blueprint('api', __name__)

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Legal AI Buddy is running'})

@api_bp.route('/upload', methods=['POST'])
def upload_document():
    """Upload a legal document for analysis"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add timestamp to avoid conflicts
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Store metadata
        metadata = {
            'filename': filename,
            'original_filename': secure_filename(file.filename),
            'upload_date': timestamp,
            'filepath': filepath
        }
        
        return jsonify({
            'message': 'File uploaded successfully',
            'document_id': filename,
            'metadata': metadata
        }), 201
    
    return jsonify({'error': 'Invalid file type. Allowed types: txt, pdf, doc, docx'}), 400

@api_bp.route('/analyze', methods=['POST'])
def analyze():
    """Analyze a legal document"""
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    analysis = analyze_contract(text)
    
    return jsonify(analysis), 200

@api_bp.route('/summarize', methods=['POST'])
def summarize():
    """Summarize a legal document in plain language"""
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    summary = summarize_document(text)
    
    return jsonify({'summary': summary}), 200

@api_bp.route('/risks', methods=['POST'])
def risks():
    """Identify risks in a legal document"""
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    risks = identify_risks(text)
    
    return jsonify({'risks': risks}), 200

@api_bp.route('/improvements', methods=['POST'])
def improvements():
    """Suggest improvements for a legal document"""
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    suggestions = suggest_improvements(text)
    
    return jsonify({'suggestions': suggestions}), 200

@api_bp.route('/templates', methods=['GET'])
def templates():
    """Get list of available templates"""
    templates_list = list_templates()
    return jsonify({'templates': templates_list}), 200

@api_bp.route('/templates/<template_type>', methods=['GET'])
def get_template_content(template_type):
    """Get a specific template"""
    template_data = get_template(template_type)
    
    if template_data:
        return jsonify(template_data), 200
    
    return jsonify({'error': 'Template not found'}), 404

@api_bp.route('/templates/<template_type>/generate', methods=['POST'])
def generate_from_template(template_type):
    """Generate a document from a template with custom data"""
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    template_data = get_template(template_type)
    
    if not template_data:
        return jsonify({'error': 'Template not found'}), 404
    
    # Replace placeholders with provided data
    content = template_data['content']
    for key, value in data.items():
        placeholder = f"{{{{{key}}}}}"
        content = content.replace(placeholder, str(value))
    
    return jsonify({
        'document': content,
        'template_type': template_type,
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'template_name': template_data['name']
        }
    }), 200

@api_bp.route('/documents', methods=['GET'])
def list_documents():
    """List all uploaded documents"""
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    if not os.path.exists(upload_folder):
        return jsonify({'documents': []}), 200
    
    documents = []
    for filename in os.listdir(upload_folder):
        if allowed_file(filename):
            filepath = os.path.join(upload_folder, filename)
            stat = os.stat(filepath)
            documents.append({
                'filename': filename,
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
            })
    
    return jsonify({'documents': documents}), 200

@api_bp.route('/documents/<document_id>', methods=['GET'])
def get_document(document_id):
    """Retrieve a specific document"""
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    # Security: ensure the document_id is safe
    safe_filename = secure_filename(document_id)
    
    if safe_filename != document_id:
        return jsonify({'error': 'Invalid document ID'}), 400
    
    filepath = os.path.join(upload_folder, document_id)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Document not found'}), 404
    
    return send_from_directory(upload_folder, document_id)

@api_bp.route('/documents/<document_id>', methods=['DELETE'])
def delete_document(document_id):
    """Delete a specific document"""
    upload_folder = current_app.config['UPLOAD_FOLDER']
    
    # Security: ensure the document_id is safe
    safe_filename = secure_filename(document_id)
    
    if safe_filename != document_id:
        return jsonify({'error': 'Invalid document ID'}), 400
    
    filepath = os.path.join(upload_folder, document_id)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'Document not found'}), 404
    
    os.remove(filepath)
    
    return jsonify({'message': 'Document deleted successfully'}), 200
