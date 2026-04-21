import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('placement_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const applicationAPI = {
  getAll: (params) => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.applications });
    }
    return api.get('/applications', { params });
  },
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  updateStatus: (id, data) => api.put(`/applications/${id}/status`, data),
  delete: (id) => api.delete(`/applications/${id}`),
  getStats: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.stats });
    }
    return api.get('/analytics/stats');
  },
};

export const analyticsAPI = {
  getStats: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.stats });
    }
    return api.get('/analytics/stats');
  },
  getWeeklyActivity: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.weekly });
    }
    return api.get('/analytics/weekly');
  },
  getDeadlineAlerts: (days = 2) => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.deadlines });
    }
    return api.get('/analytics/deadlines', { params: { days } });
  },
  getStreakData: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: { streak: 5, totalActiveDays: 12 } });
    }
    return api.get('/analytics/streak');
  },
  getInsights: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: { insights: MOCK_DATA.insights } });
    }
    return api.get('/analytics/insights');
  },
};

export const resumeAPI = {
  getAll: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.resumes });
    }
    return api.get('/resumes');
  },
  create: (data) => api.post('/resumes', data),
  delete: (id) => api.delete(`/resumes/${id}`),
};

const MOCK_DATA = {
  stats: {
    metrics: { totalApplications: 24, interviewCount: 5, offerCount: 2, rejectedCount: 8, successRate: "8.3" },
    statusDistribution: [
      { status: 'Applied', count: 10 }, { status: 'OA', count: 4 }, { status: 'Interview', count: 5 },
      { status: 'Rejected', count: 8 }, { status: 'Selected', count: 2 }
    ],
    roleDistribution: [
      { role: 'SDE', count: 12 }, { role: 'Frontend', count: 5 }, { role: 'Backend', count: 4 }, { role: 'Data Analyst', count: 3 }
    ]
  },
  weekly: [
    { day: 'Mon', count: 2 }, { day: 'Tue', count: 4 }, { day: 'Wed', count: 1 },
    { day: 'Thu', count: 5 }, { day: 'Fri', count: 3 }, { day: 'Sat', count: 0 }, { day: 'Sun', count: 2 }
  ],
  deadlines: {
    today: [{ id: 1, role: 'Software Engineer', company: 'Google' }],
    tomorrow: [{ id: 2, role: 'Frontend Developer', company: 'Amazon' }],
    missed: []
  },
  insights: [
    "Your interview conversion rate is 21%, which is above the platform average.",
    "Companies like Amazon and Google are currently hiring for SDE roles in your region.",
    "Consider refining your 'Project' section on your SDE Resume for better OA shortlisting.",
    "Most of your applications are for 'SDE' roles - try exploring 'Product Engineer' roles too."
  ],
  resumes: [
    { id: 1, title: 'Master SDE Resume', tags: 'SDE, Full Stack', createdAt: '2024-03-10', fileUrl: '#' },
    { id: 2, title: 'Frontend Specialist', tags: 'React, UI/UX', createdAt: '2024-03-15', fileUrl: '#' }
  ],
  companies: [
    { id: 1, name: 'Google', type: 'Product Based', notes: 'Very technical. Loves data structures.', questionsAsked: 'Binary Search, System Design, Leadership Principles' },
    { id: 2, name: 'Amazon', type: 'Product Based', notes: 'Focus on 16 Leadership Principles.', questionsAsked: 'Graph Traversal, Array manipulation, LRU Cache' },
    { id: 3, name: 'Meta', type: 'Product Based', notes: 'Fast paced interviews.', questionsAsked: 'String algorithms, Recursive problems' }
  ],
  applications: [
    { 
      id: 1, 
      role: 'SDE Intern', 
      status: 'Interview', 
      priority: 'Dream', 
      appliedDate: '2024-03-01', 
      jobLink: 'https://careers.google.com',
      notes: 'Focus on System Design and Scalability.',
      interviewDate: new Date(Date.now() + 1000*60*60*24*2).toISOString().split('T')[0],
      Company: { name: 'Google' }
    },
    {
      id: 2,
      role: 'Frontend Engineer',
      status: 'Interview',
      priority: 'Dream',
      appliedDate: '2024-03-12',
      deadline: '2024-04-10',
      jobLink: 'https://metacareers.com',
      notes: 'Prepare React and Performance optimization topics.',
      interviewDate: new Date().toISOString().split('T')[0],
      Company: { name: 'Meta' }
    },
    { id: 3, Company: { name: 'Meta' }, role: 'Product Engineer', status: 'Applied', priority: 'Medium', appliedDate: '2024-03-10', deadline: null, notes: '' },
    { id: 4, Company: { name: 'Netflix' }, role: 'Backend Developer', status: 'Rejected', priority: 'Dream', appliedDate: '2024-02-15', deadline: null, notes: '' },
    { id: 5, Company: { name: 'Adobe' }, role: 'SDE 1', status: 'Selected', priority: 'Medium', appliedDate: '2024-02-20', deadline: null, notes: 'Got the offer!' }
  ]
};

export const companyAPI = {
  getAll: () => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      return Promise.resolve({ data: MOCK_DATA.companies });
    }
    return api.get('/companies');
  },
  add: (data) => api.post('/companies', data),
  getOne: (id) => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      const company = MOCK_DATA.companies.find(c => c.id === Number(id));
      const apps = MOCK_DATA.applications.filter(a => a.Company.name === company?.name);
      return Promise.resolve({ data: { ...company, Applications: apps } });
    }
    return api.get(`/companies/${id}`);
  },
};

export const aiAPI = {
  generateInsights: (companyName) => api.post('/ai/insights', { companyName }),
  chat: (data) => {
    if (localStorage.getItem('placement_token') === 'demo-token') {
      const mockAnswers = [
        "Demo Insight: Focus on System Design for big tech companies.",
        "Demo Insight: Referral counts are 2x more effective than direct application.",
        "Demo Insight: Your SDE resume matches 85% of job descriptions in your stack."
      ];
      return Promise.resolve({ data: { answer: `[Demo Mode] ${mockAnswers[Math.floor(Math.random() * mockAnswers.length)]}` } });
    }
    return api.post('/ai/chat', data);
  }
};

export default api;
