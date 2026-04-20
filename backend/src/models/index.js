const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  darkMode: { type: DataTypes.BOOLEAN, defaultValue: true },
  deadlineAlerts: { type: DataTypes.BOOLEAN, defaultValue: true },
  streakReminders: { type: DataTypes.BOOLEAN, defaultValue: true },
  reminderDays: { type: DataTypes.INTEGER, defaultValue: 2 }
});

// Resume Model
const Resume = sequelize.define('Resume', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  title: { type: DataTypes.STRING, allowNull: false },
  fileUrl: { type: DataTypes.STRING, defaultValue: '' },
  tags: { type: DataTypes.STRING, defaultValue: '' }
});

// Company Model
const Company = sequelize.define('Company', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'Product' },
  interviewRounds: { type: DataTypes.TEXT },
  questionsAsked: { type: DataTypes.TEXT, defaultValue: '' },
  notes: { type: DataTypes.TEXT, defaultValue: '' }
});

// Application Model
const Application = sequelize.define('Application', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  role: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' },
  status: { type: DataTypes.STRING, defaultValue: 'Applied' },
  appliedDate: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  deadline: { type: DataTypes.DATEONLY, allowNull: true },
  jobLink: { type: DataTypes.STRING, defaultValue: '' },
  notes: { type: DataTypes.TEXT, defaultValue: '' },
  interviewDate: { type: DataTypes.DATEONLY, allowNull: true }
});

// Reminder Model
const Reminder = sequelize.define('Reminder', {
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  type: { type: DataTypes.STRING, defaultValue: 'Follow-up' },
  description: { type: DataTypes.STRING },
  dueDate: { type: DataTypes.DATE, allowNull: false },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Relationships
User.hasMany(Application);
Application.belongsTo(User);

User.hasMany(Resume);
Resume.belongsTo(User);

Application.belongsTo(Resume, { as: 'linkedResume', foreignKey: 'linkedResumeId' });
Application.belongsTo(Company);
Company.hasMany(Application);

User.hasMany(Reminder);
Reminder.belongsTo(User);

Application.hasMany(Reminder);
Reminder.belongsTo(Application);

module.exports = { User, Resume, Company, Application, Reminder, sequelize };
