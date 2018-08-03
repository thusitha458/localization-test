
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

function distanceOfADegreeOfLongitude () {
    return 111;
}

function distanceOfADegreeOfLatitude (latitude) {
    return 111 * Math.cos(Math.radians(latitude));
}

module.exports.getAdjustmentsForOneDegreeOfCoordinates = function getAdjustmentForCoordinates (latitude) {
    return {
        latitudeAdjustment: distanceOfADegreeOfLatitude(latitude),
        longitudeAdjustment: distanceOfADegreeOfLongitude()
    };
};

// let radius = 5;
// let adjustments = getAdjustmentForCoordinates(30);
// let latAdj = 5 / adjustments.latitudeAdjustment;
// let longAdj = 5 / adjustments.longitudeAdjustment;
//
// console.log({
//     latAdj: latAdj,
//     longAdj: longAdj
// });