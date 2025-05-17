const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Temporary route for tasks
router.get('/', auth, (req, res) => {
  res.status(200).json({ 
    tasks: [
      {
        id: '1', 
        title: 'Разработать API', 
        description: 'Разработать RESTful API для приложения', 
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2', 
        title: 'Создать компоненты интерфейса', 
        description: 'Создать основные компоненты для мобильного приложения', 
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3', 
        title: 'Тестирование приложения', 
        description: 'Провести тестирование функциональности приложения', 
        status: 'todo',
        priority: 'low',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    ] 
  });
});

module.exports = router; 