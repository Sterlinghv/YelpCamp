const Campground = require('../models/campground');

//get all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
};

//render the new campground create form
module.exports.renderNewForm = (req, res)=> {
    res.render('campgrounds/new');
};

//create a new campground
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

//show campground specifics
module.exports.showCampground = async (req, res, next) => {
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
};

//render the edit campground form
module.exports.renderEditForm = async(req, res) => {
    const {id}  = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

//update campground
module.exports.updateCampground = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

//delete campground
module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground!');
    res.redirect('/campgrounds');
};