const express = require('express');
const { getRolById } = require('../controllers/rolController');
const router = express.Router();

router.get('/rol/:id_rol', getRolById);

module.exports = router;
