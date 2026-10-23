import api from './api';

const calendarService = {
  getStudentCalendarEvents: () => api.get('/students/me/calendar')
};

export default calendarService;

