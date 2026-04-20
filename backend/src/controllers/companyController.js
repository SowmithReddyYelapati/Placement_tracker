const { Company, Application } = require('../models');

exports.getCompanies = async (req, res) => {
  try {
    // Return companies that this user has applied to
    const userApplications = await Application.findAll({
      where: { UserId: req.user.id },
      attributes: ['CompanyId'],
      include: [{ model: Company, required: true }]
    });

    // Deduplicate by CompanyId
    const seen = new Set();
    const companies = [];
    for (const app of userApplications) {
      if (app.Company && !seen.has(app.CompanyId)) {
        seen.add(app.CompanyId);
        companies.push(app.Company);
      }
    }
    companies.sort((a, b) => a.name.localeCompare(b.name));
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch companies', error: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const { name, type, questionsAsked, notes } = req.body;
    if (!name) return res.status(400).json({ message: 'Company name is required' });

    const [company, created] = await Company.findOrCreate({
      where: { name },
      defaults: {
        type: type || 'Product',
        questionsAsked: questionsAsked || '',
        notes: notes || ''
      }
    });

    if (!created) {
      if (type) company.type = type;
      if (questionsAsked) company.questionsAsked = questionsAsked;
      if (notes) company.notes = notes;
      await company.save();
    }

    res.status(created ? 201 : 200).json(company);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create company', error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: Application, attributes: ['role', 'status', 'appliedDate'] }]
    });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch company', error: error.message });
  }
};
