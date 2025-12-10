import os
import re
import spacy
from typing import List, Dict, Optional

# Try to load spaCy model, fallback to basic processing if not available
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None
    print("Warning: spaCy model 'en_core_web_sm' not found. NLP features will be limited.")
    print("Install it with: python -m spacy download en_core_web_sm")

# OpenAI integration (optional - works without API key for demo)
try:
    import openai
    openai.api_key = os.environ.get('OPENAI_API_KEY', '')
    USE_OPENAI = bool(openai.api_key)
except ImportError:
    USE_OPENAI = False
    print("Warning: OpenAI library not installed. Install with: pip install openai")

def extract_entities(text: str) -> List[Dict]:
    """Extract named entities from text using spaCy"""
    if not nlp:
        return []
    
    doc = nlp(text)
    entities = []
    
    for ent in doc.ents:
        entities.append({
            'text': ent.text,
            'label': ent.label_,
            'start': ent.start_char,
            'end': ent.end_char
        })
    
    return entities

def extract_key_terms(text: str) -> List[str]:
    """Extract key legal terms from the document"""
    legal_terms = [
        'agreement', 'contract', 'party', 'parties', 'obligation', 'liability',
        'warranty', 'indemnification', 'termination', 'confidential', 'disclosure',
        'intellectual property', 'jurisdiction', 'arbitration', 'damages',
        'breach', 'covenant', 'consideration', 'force majeure', 'amendment'
    ]
    
    text_lower = text.lower()
    found_terms = []
    
    for term in legal_terms:
        if term in text_lower:
            # Count occurrences
            count = text_lower.count(term)
            found_terms.append({'term': term, 'count': count})
    
    # Sort by count
    found_terms.sort(key=lambda x: x['count'], reverse=True)
    
    return found_terms[:10]  # Return top 10

def analyze_contract(text: str) -> Dict:
    """Comprehensive contract analysis"""
    analysis = {
        'word_count': len(text.split()),
        'character_count': len(text),
        'entities': extract_entities(text),
        'key_terms': extract_key_terms(text),
        'sections': extract_sections(text),
        'complexity_score': calculate_complexity(text)
    }
    
    return analysis

def extract_sections(text: str) -> List[Dict]:
    """Extract sections from the document"""
    # Look for common section patterns
    section_patterns = [
        r'\b(\d+\.)\s+([A-Z][^\n]{10,100})',  # Numbered sections
        r'\b([A-Z][A-Z\s]{3,50})\n',  # All caps headers
        r'\n([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:)',  # Title case headers with colon
    ]
    
    sections = []
    
    for pattern in section_patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            sections.append({
                'title': match.group(0).strip(),
                'position': match.start()
            })
    
    # Remove duplicates and sort by position
    seen = set()
    unique_sections = []
    for section in sections:
        if section['title'] not in seen:
            seen.add(section['title'])
            unique_sections.append(section)
    
    unique_sections.sort(key=lambda x: x['position'])
    
    return unique_sections[:15]  # Return up to 15 sections

def calculate_complexity(text: str) -> Dict:
    """Calculate document complexity metrics"""
    sentences = text.split('.')
    words = text.split()
    
    avg_sentence_length = len(words) / max(len(sentences), 1)
    
    # Count complex words (>3 syllables, simplified)
    complex_words = sum(1 for word in words if len(word) > 12)
    
    complexity_score = min((avg_sentence_length / 20 + complex_words / len(words)) * 50, 100)
    
    return {
        'score': round(complexity_score, 2),
        'average_sentence_length': round(avg_sentence_length, 2),
        'complexity_level': 'High' if complexity_score > 70 else 'Medium' if complexity_score > 40 else 'Low'
    }

def summarize_document(text: str) -> str:
    """Generate plain language summary of the document"""
    if USE_OPENAI:
        return summarize_with_openai(text)
    else:
        return summarize_basic(text)

def summarize_basic(text: str) -> str:
    """Basic summarization without OpenAI"""
    # Extract first few sentences and key information
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    
    # Get first 3 sentences
    intro = '. '.join(sentences[:3]) + '.'
    
    # Extract key terms
    key_terms = extract_key_terms(text)
    terms_summary = "Key terms mentioned: " + ", ".join([t['term'] for t in key_terms[:5]])
    
    # Count parties (simple heuristic)
    parties_count = text.lower().count('party') + text.lower().count('parties')
    
    summary = f"""Plain Language Summary:

{intro}

This document is a legal agreement containing approximately {len(text.split())} words. {terms_summary}.

The document references parties {parties_count} times and appears to establish binding obligations between the involved parties.

Note: This is a basic summary. For detailed analysis, please review the full document or use OpenAI integration for enhanced summaries."""
    
    return summary

def summarize_with_openai(text: str) -> str:
    """Generate summary using OpenAI GPT"""
    try:
        # Truncate text if too long (GPT-3.5 has token limits)
        max_chars = 12000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a legal assistant that provides clear, plain language summaries of legal documents."},
                {"role": "user", "content": f"Please provide a plain language summary of this legal document:\n\n{text}"}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return summarize_basic(text)

def identify_risks(text: str) -> List[Dict]:
    """Identify potential risks in the document"""
    if USE_OPENAI:
        return identify_risks_with_openai(text)
    else:
        return identify_risks_basic(text)

def identify_risks_basic(text: str) -> List[Dict]:
    """Basic risk identification"""
    text_lower = text.lower()
    
    risk_indicators = [
        {
            'keyword': 'unlimited liability',
            'risk': 'Unlimited Liability',
            'severity': 'high',
            'description': 'Document may contain unlimited liability provisions'
        },
        {
            'keyword': 'indemnify',
            'risk': 'Indemnification Obligations',
            'severity': 'medium',
            'description': 'Contains indemnification clauses that may create liability'
        },
        {
            'keyword': 'non-compete',
            'risk': 'Non-Compete Restriction',
            'severity': 'medium',
            'description': 'May restrict future business activities'
        },
        {
            'keyword': 'automatic renewal',
            'risk': 'Automatic Renewal',
            'severity': 'medium',
            'description': 'Contract may automatically renew without notice'
        },
        {
            'keyword': 'binding arbitration',
            'risk': 'Mandatory Arbitration',
            'severity': 'medium',
            'description': 'Requires arbitration, limiting legal options'
        },
        {
            'keyword': 'liquidated damages',
            'risk': 'Liquidated Damages',
            'severity': 'high',
            'description': 'Pre-determined damages amounts may be substantial'
        },
        {
            'keyword': 'personal guarantee',
            'risk': 'Personal Guarantee',
            'severity': 'high',
            'description': 'May require personal assets as collateral'
        },
        {
            'keyword': 'waive',
            'risk': 'Rights Waiver',
            'severity': 'high',
            'description': 'May waive important legal rights'
        }
    ]
    
    identified_risks = []
    
    for indicator in risk_indicators:
        if indicator['keyword'] in text_lower:
            identified_risks.append({
                'risk': indicator['risk'],
                'severity': indicator['severity'],
                'description': indicator['description'],
                'found': True
            })
    
    # Add general risks
    if 'termination' in text_lower:
        identified_risks.append({
            'risk': 'Termination Clauses',
            'severity': 'low',
            'description': 'Review termination conditions carefully',
            'found': True
        })
    
    if not identified_risks:
        identified_risks.append({
            'risk': 'No Major Risks Detected',
            'severity': 'low',
            'description': 'No obvious high-risk terms found, but professional review recommended',
            'found': False
        })
    
    return identified_risks

def identify_risks_with_openai(text: str) -> List[Dict]:
    """Identify risks using OpenAI GPT"""
    try:
        max_chars = 12000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a legal assistant that identifies risks in legal documents. Respond with a JSON array of risks, each with 'risk', 'severity' (high/medium/low), and 'description' fields."},
                {"role": "user", "content": f"Identify potential risks in this legal document:\n\n{text}"}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        # Parse response (assuming JSON format)
        import json
        risks = json.loads(response.choices[0].message.content)
        return risks
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return identify_risks_basic(text)

def suggest_improvements(text: str) -> List[Dict]:
    """Suggest improvements for the document"""
    if USE_OPENAI:
        return suggest_improvements_with_openai(text)
    else:
        return suggest_improvements_basic(text)

def suggest_improvements_basic(text: str) -> List[Dict]:
    """Basic improvement suggestions"""
    suggestions = []
    
    # Check for missing common clauses
    text_lower = text.lower()
    
    if 'confidentiality' not in text_lower and 'confidential' not in text_lower:
        suggestions.append({
            'category': 'Missing Clause',
            'suggestion': 'Add Confidentiality Clause',
            'description': 'Consider adding a confidentiality clause to protect sensitive information',
            'priority': 'medium'
        })
    
    if 'termination' not in text_lower:
        suggestions.append({
            'category': 'Missing Clause',
            'suggestion': 'Add Termination Clause',
            'description': 'Include clear termination conditions and notice periods',
            'priority': 'high'
        })
    
    if 'governing law' not in text_lower and 'jurisdiction' not in text_lower:
        suggestions.append({
            'category': 'Missing Clause',
            'suggestion': 'Add Governing Law Clause',
            'description': 'Specify which jurisdiction\'s laws govern the agreement',
            'priority': 'high'
        })
    
    if 'dispute resolution' not in text_lower and 'arbitration' not in text_lower:
        suggestions.append({
            'category': 'Missing Clause',
            'suggestion': 'Add Dispute Resolution Clause',
            'description': 'Define how disputes will be resolved (mediation, arbitration, litigation)',
            'priority': 'medium'
        })
    
    if 'amendment' not in text_lower and 'modification' not in text_lower:
        suggestions.append({
            'category': 'Missing Clause',
            'suggestion': 'Add Amendment Clause',
            'description': 'Specify how the agreement can be modified in the future',
            'priority': 'low'
        })
    
    # Complexity suggestions
    complexity = calculate_complexity(text)
    if complexity['score'] > 70:
        suggestions.append({
            'category': 'Readability',
            'suggestion': 'Simplify Language',
            'description': 'Document has high complexity. Consider using simpler language and shorter sentences',
            'priority': 'medium'
        })
    
    if not suggestions:
        suggestions.append({
            'category': 'General',
            'suggestion': 'Professional Review',
            'description': 'Document appears complete, but professional legal review is always recommended',
            'priority': 'low'
        })
    
    return suggestions

def suggest_improvements_with_openai(text: str) -> List[Dict]:
    """Suggest improvements using OpenAI GPT"""
    try:
        max_chars = 12000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a legal assistant that suggests improvements for legal documents. Respond with a JSON array of suggestions, each with 'category', 'suggestion', 'description', and 'priority' (high/medium/low) fields."},
                {"role": "user", "content": f"Suggest improvements for this legal document:\n\n{text}"}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        import json
        suggestions = json.loads(response.choices[0].message.content)
        return suggestions
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return suggest_improvements_basic(text)

def list_templates() -> List[Dict]:
    """List all available document templates"""
    templates = [
        {
            'id': 'nda',
            'name': 'Non-Disclosure Agreement (NDA)',
            'description': 'Standard NDA for protecting confidential information',
            'category': 'Confidentiality'
        },
        {
            'id': 'rental_agreement',
            'name': 'Rental Agreement',
            'description': 'Residential property rental/lease agreement',
            'category': 'Real Estate'
        },
        {
            'id': 'employment_contract',
            'name': 'Employment Contract',
            'description': 'Standard employment agreement',
            'category': 'Employment'
        },
        {
            'id': 'service_agreement',
            'name': 'Service Agreement',
            'description': 'Professional services contract',
            'category': 'Business'
        },
        {
            'id': 'consulting_agreement',
            'name': 'Consulting Agreement',
            'description': 'Independent contractor/consulting agreement',
            'category': 'Business'
        }
    ]
    
    return templates

def get_template(template_type: str) -> Optional[Dict]:
    """Get a specific template by type"""
    templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'templates')
    template_file = os.path.join(templates_dir, f'{template_type}.txt')
    
    if os.path.exists(template_file):
        with open(template_file, 'r') as f:
            content = f.read()
        
        # Get template info
        templates_list = list_templates()
        template_info = next((t for t in templates_list if t['id'] == template_type), None)
        
        if template_info:
            return {
                'id': template_type,
                'name': template_info['name'],
                'description': template_info['description'],
                'category': template_info['category'],
                'content': content
            }
    
    return None
