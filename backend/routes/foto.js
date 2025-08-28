const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotoController');

router.get('/', fotoController.getAllFoto);
router.post('/', fotoController.createFoto);
router.get('/:id', fotoController.getFotoById);
router.put('/:id', fotoController.updateFoto);
router.delete('/:id', fotoController.deleteFoto);

module.exports = router;
