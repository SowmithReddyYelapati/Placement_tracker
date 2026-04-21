require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const companyRoutes = require('./routes/companyRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/health', (req, res) => res.send('Placement Intelligence API is healthy!'));

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync().then(async () => {
  console.log('Database synced successfully.');
  
  // Manual migration for SQLite if alter:true failed
  try {
    const [results] = await sequelize.query("PRAGMA table_info(Users)");
    const columns = results.map(r => r.name);
    
    const missingColumns = [];
    if (!columns.includes('darkMode')) missingColumns.push("ADD COLUMN darkMode BOOLEAN DEFAULT 1");
    if (!columns.includes('deadlineAlerts')) missingColumns.push("ADD COLUMN deadlineAlerts BOOLEAN DEFAULT 1");
    if (!columns.includes('streakReminders')) missingColumns.push("ADD COLUMN streakReminders BOOLEAN DEFAULT 1");
    if (!columns.includes('reminderDays')) missingColumns.push("ADD COLUMN reminderDays INTEGER DEFAULT 2");
    
    for (const statement of missingColumns) {
      await sequelize.query(`ALTER TABLE Users ${statement}`);
      console.log(`Manual migration: Added column to Users table: ${statement.split(' ')[2]}`);
    }
  } catch (err) {
    console.error('Migration check failed:', err.message);
  }

  // Create demo user if it doesn't exist
  try {
    const { User } = require('./models');
    await User.findOrCreate({
      where: { id: 'demo-user-id' },
      defaults: {
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'demo-password-unused',
        darkMode: true,
        deadlineAlerts: true,
        streakReminders: true,
        reminderDays: 2
      }
    });
    console.log('Demo user ensured.');
  } catch (err) {
    console.error('Failed to seed demo user:', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
