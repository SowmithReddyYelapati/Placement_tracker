const { Resume } = require('../models');

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes', error: error.message });
  }
};

exports.createResume = async (req, res) => {
  try {
    const { title, fileUrl, tags } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const resume = await Resume.create({
      title,
      fileUrl: fileUrl || '',
      tags: tags || '',
      UserId: req.user.id
    });
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create resume', error: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resume.destroy({ where: { id, UserId: req.user.id } });
    if (!deleted) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
};
