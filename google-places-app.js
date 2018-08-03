const express = require('express');
const bodyParser = require('body-parser');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBa4zSP-EpzKYSVGyOKArmvWMJjeke5a4E'
});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/api/nearby/shops', (req, res) => {
    try {
        let coordinates = req.query.location.split(',');
        let latitude = parseFloat(coordinates[0]);
        let longitude = parseFloat(coordinates[1]);
        let radius = parseInt(req.query.radius);
        if (radius > 50000) {
            throw new Error('Radius cannot be more than 50000m.');
        }
        console.log('Latitude:', latitude, ', Longitude:', longitude, ', Radius:', radius);
        googleMapsClient.placesNearby({
            location: [latitude,longitude],
            radius: radius
        }, function(err, response) {
            if (!err) {
                let shops = response.json.results.map((result) => {
                    return {
                        googlePlaceId: result.place_id,
                        name: result.name
                    }
                });
                res.json({
                    shops: shops,
                    nextPageToken: response.json.next_page_token
                });
            } else {
                res.status(500).json({
                    error: 'Server error'
                });
            }
        });
    } catch (exception) {
        res.status(400).json({
            error: 'Bad request'
        });
    }
});

app.get('/api/nearby/shops/next', (req, res) => {
    try {
        console.log('Next page');
        googleMapsClient.placesNearby({
            pagetoken: req.query.nextPageToken
        }, function(err, response) {
            if (!err) {
                let shops = response.json.results.map((result) => {
                    return {
                        googlePlaceId: result.place_id,
                        name: result.name
                    }
                });
                res.json({
                    shops: shops,
                    nextPageToken: response.json.next_page_token
                });
            } else {
                res.status(500).json({
                    error: 'Server error'
                });
            }
        });
    } catch (exception) {
        res.status(400).json({
            error: 'Bad request'
        });
    }
});

app.listen(3000, (error) => {
    if (error) {
        return console.log('Starting server failed due to:', error);
    }
    console.log('Successfully started server!!!');
});
