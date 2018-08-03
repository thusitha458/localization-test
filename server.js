const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Retailer = require('./models/retailer');
const latLngUtils = require('./lat-long');

mongoose.connect('mongodb://localhost:27017/LocalizationApp', (error) => {
    if (error) {
        console.log('Mongodb connection failed:', error)
    } else {
        console.log('Mongodb connection successful');
    }
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('find-shops');
});

app.get('/add', (req, res) => {
    res.render('retailer-form');
});

app.get('/api/retailers/nearby', async (req, res) => {
    let distance = Number(req.query.distance) / 1000; // distance in meters, convert to km
    let latitude = Number(req.query.latitude);
    let longitude = Number(req.query.longitude);
    try {

        let retailers = await Retailer.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [longitude, latitude], (distance / 6378.1)
                    ]
                }
            }
        });
        let retailersResponse = retailers.map((retailer) => {
            return {
                id: retailer._id,
                name: retailer.name,
                owner: retailer.owner,
                longitude: retailer.location.coordinates[0],
                latitude: retailer.location.coordinates[1]
            }
        });
        res.json({
            retailers: retailersResponse
        });
    } catch (error) {
        console.log('An error occurred:', error);
        res.json({
            error: error
        });
    }
});

app.get('/api/retailers/nearby/sorted', async (req, res) => {
    let distance = Number(req.query.distance);
    let latitude = Number(req.query.latitude);
    let longitude = Number(req.query.longitude);
    try {

        let retailers = await Retailer.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: distance
                }
            }
        });
        let retailersResponse = retailers.map((retailer) => {
            return {
                id: retailer._id,
                name: retailer.name,
                owner: retailer.owner,
                longitude: retailer.location.coordinates[0],
                latitude: retailer.location.coordinates[1]
            }
        });
        res.json({
            retailers: retailersResponse
        });
    } catch (error) {
        console.log('An error occurred:', error);
        res.json({
            error: error
        });
    }
});

app.post('/api/retailers/add', (req, res) => {
    console.log(req.body.name, req.body.owner, req.body.location);
    new Retailer({
        name: req.body.name,
        owner: req.body.owner,
        location: {
            type: 'Point',
            coordinates: [Number(req.body.location.lng), Number(req.body.location.lat)]
        }
    }).save().then((retailer) => {
        res.json({});
    }).catch((error) => {
        console.log('An error occurred:', error);
        res.json({
            error: error
        });
    });
});

app.listen(3000, (error) => {
    if (error) {
        return console.log('Starting server failed due to:', error);
    }
    console.log('Successfully started server!!!');
});
