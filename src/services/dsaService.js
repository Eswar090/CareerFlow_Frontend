import api from './api';

const dsaService = {
  getTopics: () => api.get('/students/me/dsa'),
  updateTopic: (topicKey, data) => api.put(`/students/me/dsa/${topicKey}`, data)
};

export default dsaService;

