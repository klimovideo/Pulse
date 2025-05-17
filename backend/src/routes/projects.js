const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Temporary route for projects
router.get('/', auth, (req, res) => {
  res.status(200).json({ 
    projects: [
      {
        id: '1',
        name: 'Мобильное приложение PulseReact',
        description: 'Разработка мобильного приложения для управления проектами',
        status: 'active',
        members: [
          { id: '1', name: 'Александр Иванов', role: 'owner' },
          { id: '2', name: 'Мария Петрова', role: 'admin' }
        ],
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Веб-сайт компании',
        description: 'Разработка и поддержка корпоративного веб-сайта',
        status: 'active',
        members: [
          { id: '1', name: 'Александр Иванов', role: 'member' },
          { id: '3', name: 'Иван Сидоров', role: 'owner' }
        ],
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        endDate: null
      }
    ]
  });
});

module.exports = router; 