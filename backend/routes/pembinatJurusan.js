const express = require('express');
const router = express.Router();
const pembinatJurusanController = require('../controllers/pembinatJurusanController');

router.get('/', pembinatJurusanController.getAllJurusan);
router.post('/', pembinatJurusanController.createJurusan);
router.get('/:id', pembinatJurusanController.getJurusanById);
router.put('/:id', pembinatJurusanController.updateJurusan);
router.delete('/:id', pembinatJurusanController.deleteJurusan);

module.exports = router;
