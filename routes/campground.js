const express = require('express');
const router = express.Router();
const makeEror = require('../utility/expressEror');
const Campground = require('../models/campground');
const Joi = require("joi");
const {isLoggedin} = require('../middleware');
const campground = require('../models/campground');


//server side validations
const validateCampSchema = (req,res,next)=>{
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(2),
            image:Joi.string().required(),
            location:Joi.string().required(),
            description:Joi.string().required()
        }).required()
    })
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new makeEror(msg,400);
    }
    else{
        next();
    }
}


router.get('/',async (req,res,next)=>{
    try{
        const campgrounds =  await Campground.find({});
        res.render('campgrounds/index',{campgrounds});
    }
    catch(err){
        next(err);
    }
})
router.get('/new',isLoggedin,(req,res)=>{
    res.render('campgrounds/new');
})

router.post('/',validateCampSchema,isLoggedin,async (req,res,next)=>{
    try{

        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success','Succesfully made a new campground');
        res.redirect(`/campgrounds/${campground._id}`); 
    }
    catch(err){
        next(err);
    }
})

router.delete('/:id',async (req,res,next)=>{
    try{
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds')
    }
    catch(err){
        next(err);
    }
}) 

router.get('/:id/edit',async (req,res,next)=>{
    try{
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit',{campground});
    }
    catch(err){
        next(err);
    }
})
router.put('/:id',isLoggedin,validateCampSchema,async (req,res,next)=>{
    try{
        const { id }=req.params;
        console.log(req.user);
        // const campground = await Campground.findByIdAndUpdate(id,{ ...req.body.campground});
        const campground = await Campground.findById(id);
        if(!campground.author.equals(req.user._id)){
            req.flash('error', 'Tere se nhi hoga rehne de');
            return res.redirect(`/campgrounds/${campground._id}`);
        }
        const camp = await Campground.findByIdAndUpdate(id,{ ...req.body.campground});
        req.flash('success','Succesfully updated a campground');
        res.redirect(`/campgrounds/${campground._id}`);
    }
    catch(err){
        next(err);
    }
})
router.get('/:id',async (req,res,next)=>{
    try{
        const campground = await Campground.findById(req.params.id).populate({
            path:'reviews',
            populate:{
                path:'author'
            }
        }).populate('author');
        console.log(campground);
        if(!campground){
            req.flash('error',"Can't find that campground");
            return res.redirect('/campgrounds')
        }
        res.render('campgrounds/show',{ campground });
    }
    catch(err){
        next(err);
    }
})

module.exports = router;