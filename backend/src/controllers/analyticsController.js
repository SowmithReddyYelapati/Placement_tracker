const { Application, Company, Resume } = require('../models');
const sequelize = require('../config/db');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalApplications = await Application.count({ where: { UserId: userId } });
    const interviewCount = await Application.count({ where: { UserId: userId, status: 'Interview' } });
    const offerCount = await Application.count({ where: { UserId: userId, status: 'Selected' } });
    const rejectedCount = await Application.count({ where: { UserId: userId, status: 'Rejected' } });

    const statusDistribution = await Application.findAll({
      where: { UserId: userId },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status'],
      raw: true
    });

    const roleDistribution = await Application.findAll({
      where: { UserId: userId },
      attributes: ['role', [sequelize.fn('COUNT', sequelize.col('role')), 'count']],
      group: ['role'],
      raw: true
    });

    res.json({
      metrics: {
        totalApplications,
        interviewCount,
        offerCount,
        rejectedCount,
        successRate: totalApplications > 0 ? ((offerCount / totalApplications) * 100).toFixed(1) : 0
      },
      statusDistribution: statusDistribution.map(item => ({
        status: item.status,
        count: parseInt(item.count)
      })),
      roleDistribution: roleDistribution.map(item => ({
        role: item.role,
        count: parseInt(item.count)
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

exports.getWeeklyActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const count = await Application.count({
        where: { UserId: userId, appliedDate: dateStr }
      });

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        count
      });
    }

    res.json(days);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get weekly activity', error: error.message });
  }
};

exports.getDeadlineAlerts = async (req, res) => {
  try {
    const userId = req.user.id;
    const leadDays = parseInt(req.query.days) || 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const targetDate = new Date(today);
    targetDate.setDate(targetDate.getDate() + leadDays);
    const targetStr = targetDate.toISOString().split('T')[0];

    const activeStatuses = ['Applied', 'OA', 'Interview'];

    const allUpcoming = await Application.findAll({
      where: { 
        UserId: userId, 
        deadline: { [Op.between]: [todayStr, targetStr] },
        status: { [Op.in]: activeStatuses } 
      },
      include: [{ model: Company, attributes: ['name'], required: false }],
      raw: true,
      nest: true
    });

    const missedApps = await Application.findAll({
      where: {
        UserId: userId,
        deadline: { [Op.lt]: todayStr, [Op.ne]: null },
        status: { [Op.in]: activeStatuses }
      },
      include: [{ model: Company, attributes: ['name'], required: false }],
      raw: true,
      nest: true
    });

    // Auto-mark missed as 'Missed'
    if (missedApps.length > 0) {
      const missedIds = missedApps.map(a => a.id);
      await Application.update({ status: 'Missed' }, { where: { id: { [Op.in]: missedIds } } });
    }

    const fmt = (item) => ({ id: item.id, role: item.role, company: item.Company?.name || 'Unknown', deadline: item.deadline });

    const results = {
      today: allUpcoming.filter(a => a.deadline === todayStr).map(fmt),
      tomorrow: allUpcoming.filter(a => a.deadline === tomorrowStr).map(fmt),
      soon: allUpcoming.filter(a => a.deadline !== todayStr && a.deadline !== tomorrowStr).map(fmt),
      missed: missedApps.map(fmt)
    };

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get deadline alerts', error: error.message });
  }
};

exports.getStreakData = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.findAll({
      where: { UserId: userId },
      attributes: ['appliedDate'],
      order: [['appliedDate', 'DESC']],
      raw: true
    });

    const uniqueDates = [...new Set(applications.map(a =>
      new Date(a.appliedDate).toISOString().split('T')[0]
    ))].sort((a, b) => b.localeCompare(a));

    let streak = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(todayStr);
      checkDate.setDate(checkDate.getDate() - i);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates[i] === checkStr) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak, totalActiveDays: uniqueDates.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get streak data', error: error.message });
  }
};

exports.getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const totalApps = await Application.count({ where: { UserId: userId } });
    const interviews = await Application.count({ where: { UserId: userId, status: 'Interview' } });
    const selected = await Application.count({ where: { UserId: userId, status: 'Selected' } });

    const insights = [
      totalApps > 0
        ? `You've applied to ${totalApps} companies with a ${((selected / totalApps) * 100).toFixed(0)}% selection rate.`
        : "Start applying to companies to unlock personalized insights.",
      interviews > 0
        ? `You've secured ${interviews} interview${interviews > 1 ? 's' : ''}. Keep the momentum going!`
        : "Focus on landing your first interview by tailoring your resume for each role.",
      "Tip: Apply to mid-size product companies — they typically have faster hiring cycles and more intern openings.",
      totalApps > 5
        ? "Consistency is key. Try to apply to at least 2-3 companies every day."
        : "Start strong! Aim to apply to at least 10 companies this week."
    ];

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate insights', error: error.message });
  }
};
