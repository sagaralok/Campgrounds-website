// 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
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require('./models/campground');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const makeEror = require('./utility/expressEror');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require("passport")
const localStrategy = require("passport-local");


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection eror"));
db.once("open",()=>{
    console.log("Connected to database");
})

app.engine('ejs',ejsMate);
app.set('view engine','ejs');//To integrate and use ejs tempelate
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.use(session({
    secret:'mySecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}) 

const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');



// Routes
app.get('/',(req,res)=>{
    res.render('home');
}) 

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
// app.use('/',userRoutes);



//Error part
app.all('*',(req,res,next)=>{
    next(new makeEror("Page Not found",404))
})
app.use((err,req,res,next)=>{
    const {status=500} = err;
    if(!err.message){
        err.message = "Something went wrong";
    }
    res.status(status).render('eror',{err});
})
app.listen(3000,()=>{
    console.log("Listening");
})