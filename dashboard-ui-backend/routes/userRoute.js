"use strict";
var express               = require('express');
var router                = express.Router();
var session               = require('express-session');
var bodyParser            = require('body-parser');
const controller          = require('../controller');
const dataController      = controller.maindata;


router.get('/',function(req, res, next) {
    res.send("user working");
});

// get users
router.get('/gt_users',dataController.maindata.fetchUsers);

//add/update users
router.post('/ad_usr',dataController.maindata.modifyUser);

//remove user
router.put('/rm_usr',dataController.maindata.removeUser);

module.exports = router;
