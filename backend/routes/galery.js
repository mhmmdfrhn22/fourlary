const express = require('express');
const router = express.Router();
const galeryController = require('../controllers/galeryController');

router.get('/', galeryController.getAllGalery);
router.post('/', galeryController.createGalery);
router.get('/:id', galeryController.getGaleryById);
router.put('/:id', galeryController.updateGalery);
router.delete('/:id', galeryController.deleteGalery);

module.exports = router;