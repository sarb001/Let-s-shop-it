
const asyncHandler = require("express-async-handler");
const Post  = require('../Models/Post');
const User  = require('../Models/User');


const getuser    = asyncHandler(async(req,res) => {

    try
    {
          await  User.findOne({_id:req.params.id})
          .select("-password")
          .then(item => {
             Post.find({postedBy:req.params.id})
             .populate("postedBy","_id name")
             .then((posts) => {
                    res.status(200).json({item,posts})
                    console.log(' Res & Posts arrre - ',{item,posts})
             }).catch(err => {
                console.log(err);
             })
         })
    }catch(err)
    {
        console.log(err)
    }
})

const followuser = asyncHandler(async(req,res) => {

    try{
        User.findByIdAndUpdate(req.body.followId,{
            $push : {followers : req.user._id}
        },{
            new: true
        }).then((result) => {
             User.findByIdAndUpdate(req.user._id,{
                $push: {following:req.body.followId}
             },{new: true}).then(result => {
                res.status(200).json(result)
             }).catch(err => {
                 res.status(422).json({error : err})
             })
        })
    }catch(err)
    {
        console.log('Err in Backend in Followuser',err)
    }
})

const unfollowuser = asyncHandler(async(req,res) => {
    try{
        User.findByIdAndUpdate(req.body.unfollowId,{
            $pull : {followers : req.user._id}
        },{
            new: true
        }).then((result) => {
             User.findByIdAndUpdate(req.user._id,{
                $pull : {following : req.body.unfollowId}
             },{new: true}).select("-password").then(result => {
                res.status(200).json(result)
             }).catch(err => {
                 res.status(422).json({error : err})
             })
        })
    }catch(err)
    {
        console.log('Err in Backend in UnFollowuser ',err)
    } 
})

const subscribedpost = asyncHandler(async(req,res) => {
    
    Post.find({postedBy: {$in: req.user.following }})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts => {
        res.status(200).json({posts})
    }).catch(err => {
        console.log(err)
    })
})

const updatepic = asyncHandler(async(req,res) => {
      User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},
        {new:true})
        .then((result) => {
            res.status(200).json(result)
            console.log(' Result is- ',result);
        })
        .catch((err) => {
            console.log({error:" Pic cannot Post "})
        })
})


module.exports = { getuser ,followuser ,unfollowuser  ,subscribedpost , updatepic }