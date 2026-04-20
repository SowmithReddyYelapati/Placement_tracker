const sequelize = require('./config/db');
const { User, Application, Company, Resume } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced. Starting seed...');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Demo Student',
      email: 'demo@example.com',
      password: hashedPassword
    });

    const resumes = await Resume.bulkCreate([
      { title: 'Backend Engineer Core', UserId: user.id },
      { title: 'Full Stack 2024', UserId: user.id },
      { title: 'AI Research Intern', UserId: user.id }
    ]);

    const companies = await Company.bulkCreate([
      { name: 'Google', type: 'Product' },
      { name: 'Stripe', type: 'Startup' },
      { name: 'Accenture', type: 'Service' },
      { name: 'Netflix', type: 'Product' }
    ]);

    await Application.bulkCreate([
      { role: 'SDE-1', status: 'Interview', CompanyId: companies[0].id, UserId: user.id, linkedResumeId: resumes[0].id, appliedDate: new Date('2024-03-01') },
      { role: 'Platform Engineer', status: 'OA', CompanyId: companies[1].id, UserId: user.id, linkedResumeId: resumes[0].id, appliedDate: new Date('2024-03-10') },
      { role: 'Associate Developer', status: 'Applied', CompanyId: companies[2].id, UserId: user.id, appliedDate: new Date('2024-03-05') },
      { role: 'Backend Intern', status: 'Selected', CompanyId: companies[3].id, UserId: user.id, linkedResumeId: resumes[1].id, appliedDate: new Date('2024-02-15') },
    ]);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();
