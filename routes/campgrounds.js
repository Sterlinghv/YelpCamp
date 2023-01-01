const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');

//const Review = require('./models/review');
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

//get all campgrounds
router.get('/', catchAsync (async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));

//populate new campground form
router.get('/new', isLoggedIn, (req, res)=> {
    res.render('campgrounds/new');
});

//create new campground
router.post('/', isLoggedIn, validateCampground, catchAsync (async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid Cameground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//show a campground
router.get('/:id', catchAsync (async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

//get for editing
router.get('/:id/edit', isLoggedIn, catchAsync (async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

//update campground
router.put('/:id', isLoggedIn, validateCampground, catchAsync (async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

//deleted a specified campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;