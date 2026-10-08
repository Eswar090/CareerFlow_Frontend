export const mockJobs = [
  { id: 1, title: 'Java Backend Developer', company: 'TechSolutions Inc.', location: 'Bangalore, India', type: 'Full-time', salary: '₹12L - ₹18L', match: 85, posted: '2 days ago', reqSkills: ['Java', 'Spring Boot', 'MySQL', 'Microservices'], matchSkills: ['Java', 'Spring Boot', 'MySQL'], missingSkills: ['Microservices'], description: 'Looking for a strong Java developer to build scalable backend systems.', eligibility: 'Eligible' },
  { id: 2, title: 'React Frontend Developer', company: 'Webify', location: 'Remote', type: 'Full-time', salary: '₹8L - ₹14L', match: 70, posted: '5 days ago', reqSkills: ['React', 'Redux', 'Tailwind', 'JavaScript'], matchSkills: ['React', 'JavaScript'], missingSkills: ['Redux', 'Tailwind'], description: 'Build beautiful UIs using React and modern CSS.', eligibility: 'Eligible' },
  { id: 3, title: 'Full Stack Developer', company: 'Startup.io', location: 'Mumbai, India', type: 'Full-time', salary: '₹10L - ₹15L', match: 90, posted: '1 week ago', reqSkills: ['React', 'Java', 'Spring Boot', 'MongoDB'], matchSkills: ['React', 'Java', 'Spring Boot'], missingSkills: ['MongoDB'], description: 'End to end development of our core product.', eligibility: 'Eligible' },
  { id: 4, title: 'Software Engineer', company: 'BigTech', location: 'Hyderabad, India', type: 'Internship', salary: '₹40k/mo', match: 60, posted: '1 day ago', reqSkills: ['C++', 'Python', 'Algorithms', 'Data Structures'], matchSkills: ['Algorithms', 'Data Structures'], missingSkills: ['C++', 'Python'], description: '6 month internship converting to FTE based on performance.', eligibility: 'Eligible' },
];

export const mockApplications = [
  { id: 101, jobId: 1, jobTitle: 'Java Backend Developer', company: 'TechSolutions Inc.', date: '2023-10-01', status: 'Shortlisted' },
  { id: 102, jobId: 2, jobTitle: 'React Frontend Developer', company: 'Webify', date: '2023-09-25', status: 'Under Review' },
  { id: 103, jobId: 3, jobTitle: 'Full Stack Developer', company: 'Startup.io', date: '2023-09-15', status: 'Applied' },
];

export const mockInterviews = [
  { id: 201, company: 'TechSolutions Inc.', jobTitle: 'Java Backend Developer', type: 'Technical Round 1', date: '2023-10-10', time: '10:00 AM', link: 'https://zoom.us/j/12345', status: 'Scheduled' }
];

export const mockNotifications = [
  { id: 1, message: 'Your application for Java Backend Developer has been shortlisted.', date: '1 hour ago', read: false },
  { id: 2, message: 'Technical interview scheduled for tomorrow with TechSolutions.', date: '2 hours ago', read: false },
  { id: 3, message: 'You are eligible for Software Engineer position at BigTech.', date: '1 day ago', read: true },
];

export const mockSkills = [
  { id: 1, name: 'Java', level: 'Advanced' },
  { id: 2, name: 'Spring Boot', level: 'Intermediate' },
  { id: 3, name: 'React', level: 'Intermediate' },
  { id: 4, name: 'MySQL', level: 'Intermediate' },
  { id: 5, name: 'Git', level: 'Intermediate' },
];
