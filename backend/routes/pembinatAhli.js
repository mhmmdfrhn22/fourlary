const express = require('express');
const router = express.Router();
const pembinatAhliController = require('../controllers/pembinatAhliController');

router.get('/', pembinatAhliController.getAllAhli);
router.post('/', pembinatAhliController.createAhli);
router.get('/:id', pembinatAhliController.getAhliById);
router.put('/:id', pembinatAhliController.updateAhli);
router.delete('/:id', pembinatAhliController.deleteAhli);

module.exports = router;
