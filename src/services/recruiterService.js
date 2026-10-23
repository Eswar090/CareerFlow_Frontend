import api from './api';

const recruiterService = {
  getProfile: async () => {
    const response = await api.get('/recruiters/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/recruiters/me', data);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/recruiters/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProfilePicture: async () => {
    const response = await api.delete('/recruiters/me/profile-picture');
    return response.data;
  },

  getCompany: async () => {
    const response = await api.get('/recruiters/me/company');
    return response.data;
  },

  createCompany: async (data) => {
    const response = await api.post('/recruiters/me/company', data);
    return response.data;
  },

  updateCompany: async (data) => {
    const response = await api.put('/recruiters/me/company', data);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/recruiters/me/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default recruiterService;
