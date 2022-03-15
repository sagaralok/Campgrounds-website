const express = require('express');
const router = express.Router({mergeParams:true});//without merge params id will not pass in this function
const makeEror = require('../utility/expressEror');
const Campground = require('../models/campground');
const Review = require('../models/review');
const Joi = require("joi");


const validateReviewSchema = (req,res,next)=>{
    const reviewSchema = Joi.object({
        review: Joi.object({
            rating: Joi.number().required().min(0),
            body:Joi.string().required()
        }).required()
    })
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new makeEror(msg,400);
    }
    else{
        next();
    }
}

router.post('/',validateReviewSchema,async(req,res,next)=>{
    try{
        const camp = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        camp.reviews.push(review);
        await review.save();
        await camp.save();
        req.flash('success','Created new review');
        res.redirect(`/campgrounds/${camp._id}`);
    }
    catch(err){
        next(err);
    }
})
router.delete('/:reviewId', async(req,res,next)=>{
    try{
        const {id,reviewId}=req.params;
        await Campground.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
        await Review.findByIdAndDelete(req.params.reviewId);
        req.flash('success','Deleted review');
        res.redirect(`/campgrounds/${id}`);
    }
    catch(err){
        next(err);
    }
})
module.exports = router;