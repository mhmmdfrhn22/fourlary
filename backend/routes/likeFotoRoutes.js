const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/likeFotoController');

router.get('/:id_foto', likeCtrl.getLikeCount);
router.get('/:id_foto/:id_user', likeCtrl.checkUserLike);
router.post('/', likeCtrl.addLike);
router.delete('/', likeCtrl.removeLike);

module.exports = router;