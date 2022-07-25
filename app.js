// Load modules
const express = require('express');
const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
// Connect to MongoURI exported from external file
const keys = require('./config/keys');

const User= require('./models/user');  //we collected user information in this variable
const Post= require('./models/post');







require('./passport/google-passport');
require('./passport/facebook-passport');


const {
    ensureAuthentication
} = require('./helpers/auth');


// initialize application
const app = express();
// Express config
 app.use(cookieParser());
 app.use(bodyParser.urlencoded({
     extended: false
 }));
 app.use(bodyParser.json());
 app.use(session({
     secret: 'keyboard cat',
     resave: true,
     saveUninitialized: true
 }));
 app.use(passport.initialize());
 app.use(passport.session());

app.use((req,res,next) => {               //user is set as a global variable
    res.locals.user= req.user || null;
    next();
})
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// setup template engine
app.engine('handlebars', exphbs.engine( {
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars');
// setup static file to serve css, javascript and images
app.use(express.static('public'));

mongoose.Promise= global.Promise;

// connect to remote database
mongoose.connect(keys.MongoURI, {
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected to Remote Database....');
}).catch((err) => {
    console.log(err);
});
// set environment variable for port
const port = process.env.PORT || 3000;
// Handle routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});
// GOOGLE AUTH ROUTE
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile','email']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });


//FB auth route
app.get('/auth/facebook',
  passport.authenticate('facebook', {
    scope: 'email'
  }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//handle profile route




app.get('/profile', ensureAuthentication, (req, res) => {
    User.findById({_id:req.user._id})     //we will find user information through user collection (line no 32(user)) and find specific id ny findById
    .then((user) => {
        res.render('profile', {
            user:user
        });
    })

    // res.render('profile');
});

app.get('/users',(req,res) => {
    User.find({}).then((users) => {       // {} retrieve all users from collection
        res.render('users', {
            users:users                   // we pass users object which contain all users data
        });
    });
});

app.get('/user/:id',(req,res) => {
    User.findById({_id: req.params.id})       //params is used to get parameter and id is used to get id from :id from line 136. We will find id matching from users collection by _id
    .then((user) => {                         //we get a specific user
        res.render('user', {
            user:user
        });
    });
});



app.post('/addPhone',(req,res) => {
    const phone= req.body.phone;
    User.findById({_id: req.user._id})
    .then((user) => {
        user.phone= phone;
        user.save()
        .then(() => {
            res.redirect('/profile');
        });
    });
});

app.post('/addLocation',(req,res) => {
    const location= req.body.location;
    User.findById({_id: req.user._id})
    .then((user) => {
        user.location= location;
        user.save()
        .then(() => {
            res.redirect('/profile');
        });
    });
});






app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});