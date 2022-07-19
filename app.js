// Load modules
const express = require('express');
const exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');

const keys = require('./config/keys');             // Connect to MongoURI exported from external file

const app = express();             // initialize application

app.engine('handlebars', exphbs.engine({            // setup template engine
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));                    // setup static file to serve css, javascript and images

mongoose.connect(keys.MongoURI, {                     // connect to remote database
    useNewUrlParser: true,
})
.then(() => {
    console.log('Connected to Remote Database....');
}).catch((err) => {
    console.log(err);
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});