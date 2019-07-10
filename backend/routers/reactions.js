const express = require('express');
const cors = require('cors');
const auth = require('../middleware/auth');
const { Reaction } = require('../model/reaction');
const router = express.Router();
router.use(cors());

//TODO Add reaction routers.

module.exports = router;
