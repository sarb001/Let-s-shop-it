const express = require('express');
const  RequireLogin     = require('../Middleware/RequireLogin');
const {  createpost , allpost , mypost ,like ,unlike , comment ,deletepost  }  = require('../Controllers/PostComtroller');

const router  = express.Router();     

router.route('/createpost').post(RequireLogin,createpost)

router.route('/allpost').get(RequireLogin,allpost)

router.route('/mypost').get(RequireLogin,mypost)


router.route('/like').put(RequireLogin,like)

router.route('/unlike').put(RequireLogin,unlike)

router.route('/comment').put(RequireLogin,comment)

router.route('/deletepost/:postId').delete(RequireLogin,deletepost)

module.exports = router;