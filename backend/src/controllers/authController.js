const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });
    
    // Auto-login after registration
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        darkMode: user.darkMode,
        deadlineAlerts: user.deadlineAlerts,
        streakReminders: user.streakReminders,
        reminderDays: user.reminderDays
      }, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'User already exists or invalid data', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        darkMode: user.darkMode,
        deadlineAlerts: user.deadlineAlerts,
        streakReminders: user.streakReminders,
        reminderDays: user.reminderDays
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, darkMode, deadlineAlerts, streakReminders, reminderDays } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    
    if (darkMode !== undefined) user.darkMode = darkMode;
    if (deadlineAlerts !== undefined) user.deadlineAlerts = deadlineAlerts;
    if (streakReminders !== undefined) user.streakReminders = streakReminders;
    if (reminderDays !== undefined) user.reminderDays = reminderDays;

    await user.save();
    res.json({ 
      message: 'Profile updated successfully', 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        darkMode: user.darkMode,
        deadlineAlerts: user.deadlineAlerts,
        streakReminders: user.streakReminders,
        reminderDays: user.reminderDays
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};
