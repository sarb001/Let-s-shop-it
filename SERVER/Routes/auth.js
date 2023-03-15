const express = require('express');
const { registeruser ,checkuser ,loginuser } = require('../Controllers/UserController');

const router = express.Router();

router.route('/check').get(checkuser);
router.route('/signup').post(registeruser);
router.route('/login').post(loginuser);

module.exports = router;


