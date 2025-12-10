import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeDocument = async (text) => {
  const response = await api.post('/analyze', { text });
  return response.data;
};

export const summarizeDocument = async (text) => {
  const response = await api.post('/summarize', { text });
  return response.data;
};

export const identifyRisks = async (text) => {
  const response = await api.post('/risks', { text });
  return response.data;
};

export const suggestImprovements = async (text) => {
  const response = await api.post('/improvements', { text });
  return response.data;
};

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const listTemplates = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export const getTemplate = async (templateType) => {
  const response = await api.get(`/templates/${templateType}`);
  return response.data;
};

export const generateFromTemplate = async (templateType, data) => {
  const response = await api.post(`/templates/${templateType}/generate`, data);
  return response.data;
};

export const listDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};

export const downloadDocument = async (documentId) => {
  window.open(`${API_BASE_URL}/documents/${documentId}`, '_blank');
};

export default api;
