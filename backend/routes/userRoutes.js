const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');

router.get('/', userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);

router.post('/',
  [
    body('username').isLength({ min: 4 }).withMessage('Minimal 4 karakter'),
    body('password').isLength({ min: 6 }).withMessage('Minimal 6 karakter'),
    body('role_id').isInt().withMessage('role_id harus angka')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.createUser(req, res);
  }
); 

router.post('/login',
  [
    body('username').isLength({ min: 4 }).withMessage('Minimal 4 karakter'),
    body('password').isLength({ min: 6 }).withMessage('Minimal 6 karakter'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.loginUser(req, res);
  }
); 
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;