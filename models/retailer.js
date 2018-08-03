const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true},
    owner: {type: String, required: true},
    // latitude: {type: Number, required: true},
    // longitude: {type: Number, required: true},
    location: {
        type: mongoose.Schema.Types.Point,
        index: '2dsphere',
        required: true
    }
}, {
    autoIndex: false
});

// schema.pre('save', function (next) {
//     if (this.isNew && Array.isArray(this.location) && 0 === this.location.length) {
//         this.location = undefined;
//     }
//     next();
// });

// schema.index({location: '2dshpere'});

module.exports = mongoose.model('retailer-index', schema);