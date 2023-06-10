const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.index)) //get all campgrounds
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync (campgrounds.createCampground)); //create new campground

//populate new campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync (campgrounds.showCampground)) //show campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync (campgrounds.updateCampground)) //update campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //delete campground

//get for editing
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync (campgrounds.renderEditForm));

module.exports = router;