/* DEPENDENCIES */

// Express/node
const express = require('express');
const app = express();
const port = 3000;
const planner = 'http://localhost:8080'; // TODO: Update live url/port

// Mongoose
const mongoose = require('mongoose');
const eventSchema = require('./schemas/eventSchema');
const colorSchema = require('./schemas/colorSchema');

// Middleware
const cors = require('cors');
const bodyParser = require('body-parser');

// Sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


/* LOGIC */

//  Establish database connection
mongoose.connect('mongodb://localhost:27017/levi', {useNewUrlParser: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', () => {
    console.log('Connected to database on port: 27017');
});


/* MIDDLEWARE */

// Enable Cors
app.use(cors());

// Configure to use bodyParser() for handling request body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// TODO: Set up middleware to hit laravel API route to verify authentication and store user data in session
app.use('/', function (req, res, next) {
    //req.session.role ? next() : res.send('unauthorized'); // Handle 'unauthorized' response on client side to redirect to login page
    console.log('Auth middleware hit');
    next();
});


/* ROUTES */

// Route to VueJS app
app.get('/planner', function (req, res) {
    res.redirect(planner);
});

// Get a date's events
app.get('/api/get-events/:user/:month/:year', async function (req, res) {
    // Create dates to search for
    let start = req.params.year + '-' + req.params.month + '-01';
    let end = req.params.year + '-' + req.params.month + '-31';

    let eventsModel = mongoose.model('Events', eventSchema);
    let result = await eventsModel.find({user: req.params.user, date: {$gte: start, $lte: end}});

    result ? res.send(result) : res.send("");
});

// Add a new event to a date
app.post('/api/add-event', async function (req, res) {
    let eventsModel = mongoose.model('Events', eventSchema);
    let newId = mongoose.Types.ObjectId();
    let newEvent = new eventsModel({
        _id: newId,
        user: req.body.user,
        date: req.body.date,
        color: req.body.color,
        data: req.body.data
    });
    newEvent.save();

    // Return new ID
    return res.send(newId);
});

// Update an existing event
app.post('/api/update-event', async function (req, res) {
    console.log(req.body);
    let eventsModel = mongoose.model('Events', eventSchema);
    await eventsModel.findOneAndUpdate(
        {_id: req.body.id},
        {
            data: req.body.data
        },
        {useFindAndModify: false}
    );

    res.send(true);
});

// Delete a date's event
app.post('/api/delete-event', async function (req, res) {
    let eventsModel = mongoose.model('Events', eventSchema);
    await eventsModel.findOneAndDelete({_id: req.body.id, user: req.body.user});

    return res.send(true);
});


//  Get all data from 'colors' collection for our event labels
app.get('/api/get-colors/:user', async function (req, res) {
    let colorsModel = mongoose.model('Colors', colorSchema);
    let colors = await colorsModel.find({user: req.params.user});

    return res.send(JSON.stringify(colors));
});

// Check for/return an existing color record
app.get('/api/get-color/:user/:color', async function (req, res) {
    let colorsModel = mongoose.model('Colors', colorSchema);
    let record = await colorsModel.findOne({user: req.params.user, color: req.params.color});

    return res.send(JSON.stringify(record));
});

// Update an existing color record
app.post('/api/update-color', async function (req, res) {
    let colorsModel = mongoose.model('Colors', colorSchema);
    await colorsModel.findOneAndUpdate(
        {_id: req.body.id},
        {label: req.body.label},
        {useFindAndModify: false}
    );

    return res.send(true);
});

// Create a new color record
app.post('/api/add-color', async function (req, res) {
    let colorsModel = mongoose.model('Colors', colorSchema);
    let newColor = new colorsModel({
        _id: mongoose.Types.ObjectId(),
        user: req.body.user,
        color: req.body.color,
        label: req.body.label
    });
    newColor.save();

    return res.send(true);
});


/* LISTENERS */
app.listen(port, () => console.log('Listening on port: ' + port));