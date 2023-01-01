const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

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
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//show a campground
router.get('/:id', catchAsync (async (req, res, next) => {
    //nested populate
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

//get for editing
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (async(req, res) => {
    const {id}  = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}));

//update campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync (async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}));

//deleted a specified campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;