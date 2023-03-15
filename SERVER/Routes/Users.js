const express = require('express');
const { getuser ,followuser ,unfollowuser , subscribedpost ,updatepic } = require('../Controllers/UsersController');
const  RequireLogin     = require('../Middleware/RequireLogin');

const router  = express.Router();     

router.route('/user/:id').get(RequireLogin,getuser)

router.route('/follow').put(RequireLogin,followuser)

router.route('/unfollow').put(RequireLogin,unfollowuser)

router.route('/subscribedpost').get(RequireLogin,subscribedpost)

router.route('/updatepic').put(RequireLogin,updatepic)


module.exports = router;
          