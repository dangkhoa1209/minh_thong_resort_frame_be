const express = require("express");
const { trackProjectViewController } = require("./analytics.controller");

const router = express.Router();

router.post("/project-view", trackProjectViewController);

module.exports = router;
