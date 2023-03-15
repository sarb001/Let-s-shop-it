
const User = require('../Models/User');
const asyncHandler =  require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const Post  = require('../Models/Post');
const crypto   = require('crypto');

const sgmail = require('@sendgrid/mail');
sgmail.setApiKey(process.env.SENDGRID_API_KEY);

console.log('api key here',process.env.SENDGRID_API_KEY);


const checkuser = asyncHandler(async(req,res) => {
    res.send(' In the Use rmain  ')
})

// register user 

const registeruser = asyncHandler(async(req,res) => {

        try
        {
            const { name,email ,password,pic } = req.body;
            console.log(' data in Backend is - ',name,email,password)
            if(!email || !password || !name){
                    return res.status(422).json({error : 'Please Fill all the Fields'})
            }

            const  finduser = await User.findOne({email})
            if(finduser){
                return res.status(422).json({error: ' User Already Present '})
            }
            const salt = await bcrypt.genSalt(10);
            const hashpass = await bcrypt.hash(req.body.password,salt);

            const user = await User.create({
                email :email,
                password : hashpass,
                name :name,
                pic
            })

            // const msg = {
            //     to :  'sarbbsandhu555@gmail.com',
            //     from: 'mrsinghbusiness05@gmail.com',
            //     subject : 'Sending with Twilio ,even with Ndoe.js',
            //     text : 'and easy totototototototototot',
            //     html : 'Easy to Do Anywhere even with Node.js'
            // };

            // (async () => {
            //     try{
            //         await sgmail.send(msg);

            //     }catch(error){
            //         console.log(error);

            //         if(error.response){
            //              console.log(error.response.body)
            //         }
            //     }
            // })();


            if(user){
                res.status(201).json({
                    _id : user._id,
                    email : user.email,
                    password: user.password,
                    name :user.name,
                    pic: user.pic
                })
            }else
            {
                res.status(400).json({error : ' Not Able to  Create User '})
            }

    }catch(error)
     {
        console.log(err);
        res.status(422).json(' Something  Wrong Happens ')
     }
})

//loggedin User

const loginuser   = asyncHandler(async(req,res) => {

    try
    {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(422).json({error: " Please Add Email or Password "})
        }
        User.findOne({email:email})
        .then(saveduser => {
                if(!saveduser)
                {
                    return res.status(422).json({error:' Invalid Email or Passwordd '})
                }
                bcrypt.compare(password,saveduser.password)
                .then(domatch => {
                    if(domatch){
                        const token = jwt.sign({_id: saveduser._id},process.env.JWT_SECRET)
                        const {_id,name,email,followers,following,pic}  = saveduser
                        res.json({token,user :{_id,name,email,followers,following,pic}})
                         console.log(' Login Sidee ',{token,_id,name,email,followers,following,pic})
                    }
                    else
                    {
                        return res.json(422).json({error:' Invalid Email or Password '}) 
                    }
                }).catch(err =>{
                    console.log(err)
                })
        })

    }catch(error)
    {
        console.log(err);
        res.status(422).json(' Something Wrong on Login Side ')
    }
})


// const resetpassword = asyncHandler(async(req,res) => {
//     try{
//         crypto.randomBytes(32,(err,buffer)  => {
//             if(err){
//                  console.log(err);
//             }
//             const token  = buffer.toString("hex")
//             User.findOne({email : req.body.email})
//             .then(user => {
//                 if(!user){
//                     return res.status(422).json({error:' User dont exists with that Email Address '})
//                 }
//                 user.resetToken = token;
//                 user.expireToken = Date.now() + 3600000;
//                 user.save().then((result) => {
//                     const msg = {
//                         to   :  'sarbbsandhu555@gmail.com',
//                         from :  'mrsinghbusiness05@gmail.com',
//                         subject : 'Password Reset ......',
//                         html : ` <p> You Requsted for Password Reset </p>
//                         <h5>  Click <a href = "http://localhost:3000/reset/${token}"> Link  </a>  in this link here......`
//                     };

//                     (async () => {
//                         try{
//                              await sgmail.send(msg);
//                         }catch(error){
//                             console.log(error);
//                             if(error.response){
//                                  console.log(error.response.body)
//                             }
//                         }
//                     })();

//                 })
//             })
//         })
//     }catch(error)
//         {
//             console.log(err);
//             res.status(422).json(' Something Wrong on Rest pasasword')
//         }
//     }
// )

module.exports = { registeruser ,checkuser ,loginuser }