const express = require('express');
const router = express.Router();

const { getServiceability } = require('../controllers/rocketShippment');


router.post('/getServiceability', getServiceability);

module.exports = router; 