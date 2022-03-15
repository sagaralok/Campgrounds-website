const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require('../models/user');

router.get('/register',(req,res)=>{
    res.render('users/register');
})
router.post('/register',async (req,res,next)=>{
    // res.send(req.body); 
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registereduser = await User.register(user,password);
        req.login(registereduser,err=>{
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to yelp camp');
            res.redirect('/campgrounds');
        })
    }
    catch(err){
        // next(err);
        req.flash('error',err.message);
        res.redirect('register');
    }
})

router.get('/login',(req,res)=>{
    res.render('users/login');
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),async (req,res)=>{
    // res.render('users/login');
    const redirectUrl  = req.session.returnTo || '/campgrounds';
    req.flash('success','welcome back');
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success','Good bye ')
    res.redirect('/campgrounds')
})

module.exports = router;

