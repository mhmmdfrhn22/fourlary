const express = require('express');
const router = express.Router();
const pembinatLoreController = require('../controllers/pembinatLoreController');

router.get('/', pembinatLoreController.getAllLore);
router.post('/', pembinatLoreController.createLore);
router.get('/:id', pembinatLoreController.getLoreById);
router.put('/:id', pembinatLoreController.updateLore);
router.delete('/:id', pembinatLoreController.deleteLore);

module.exports = router;
