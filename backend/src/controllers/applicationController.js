const { Application, Company, Resume, Reminder } = require('../models');
const { Op } = require('sequelize');

const includeClause = [
  { model: Company, attributes: ['name', 'type'], required: false },
  { model: Resume, as: 'linkedResume', attributes: ['title', 'id'], required: false }
];

exports.createApplication = async (req, res) => {
  try {
    const { companyName, role, appliedDate, status, resumeId, jobLink, notes, priority, deadline } = req.body;

    if (!companyName || !role) {
      return res.status(400).json({ message: 'Company name and role are required' });
    }

    let company = await Company.findOne({ where: { name: companyName } });
    if (!company) {
      company = await Company.create({ name: companyName });
    }

    const application = await Application.create({
      role,
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      deadline: deadline || null,
      status: status || 'Applied',
      priority: priority || 'Medium',
      jobLink: jobLink || '',
      notes: notes || '',
      UserId: req.user.id,
      CompanyId: company.id,
      linkedResumeId: resumeId || null
    });

    const fullApp = await Application.findByPk(application.id, { include: includeClause });
    res.status(201).json(fullApp);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create application', error: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { status, search, sortBy } = req.query;
    const where = { UserId: req.user.id };
    if (status && status !== 'all') where.status = status;

    let order = [['appliedDate', 'DESC']];
    if (sortBy === 'deadline') order = [['deadline', 'ASC']];

    let applications = await Application.findAll({ where, include: includeClause, order });

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter(a =>
        a.Company?.name?.toLowerCase().includes(s) ||
        a.role?.toLowerCase().includes(s)
      );
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, notes } = req.body;
    const application = await Application.findOne({ where: { id, UserId: req.user.id } });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (status) application.status = status;
    if (priority) application.priority = priority;
    if (notes !== undefined) application.notes = notes;
    await application.save();

    const updated = await Application.findByPk(id, { include: includeClause });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, notes, role, jobLink, deadline, companyName, resumeId } = req.body;
    const application = await Application.findOne({ where: { id, UserId: req.user.id } });
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (status !== undefined) application.status = status;
    if (priority !== undefined) application.priority = priority;
    if (notes !== undefined) application.notes = notes;
    if (role !== undefined) application.role = role;
    if (jobLink !== undefined) application.jobLink = jobLink;
    if (deadline !== undefined) application.deadline = deadline || null;
    if (resumeId !== undefined) application.linkedResumeId = resumeId || null;

    if (companyName) {
      let company = await Company.findOne({ where: { name: companyName } });
      if (!company) company = await Company.create({ name: companyName });
      application.CompanyId = company.id;
    }

    await application.save();
    const updated = await Application.findByPk(id, { include: includeClause });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.destroy({ where: { id, UserId: req.user.id } });
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};

exports.runReminderEngine = async (req, res) => {
  try {
    const userId = req.user.id;
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0];

    const staleApplications = await Application.findAll({
      where: { UserId: userId, status: 'Applied', appliedDate: { [Op.lte]: fiveDaysAgoStr } },
      include: [{ model: Company, required: false }]
    });

    const newReminders = [];
    for (const app of staleApplications) {
      const existing = await Reminder.findOne({ where: { ApplicationId: app.id, type: 'Follow-up' } });
      if (!existing) {
        const reminder = await Reminder.create({
          type: 'Follow-up',
          description: `Follow up with ${app.Company?.name || 'company'} for ${app.role}`,
          dueDate: new Date(),
          UserId: userId,
          ApplicationId: app.id
        });
        newReminders.push(reminder);
      }
    }
    res.json({ message: `Engine run complete. ${newReminders.length} reminders created.`, reminders: newReminders });
  } catch (error) {
    res.status(500).json({ message: 'Reminder engine failed', error: error.message });
  }
};
