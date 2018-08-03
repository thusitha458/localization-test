
// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

function harversineDistance(lat1, lon1, lat2, lon2) {
    let R = 6371e3; // metres
    let lat1Rad = Math.radians(lat1);
    // let lat1Rad = lat1.toRadians();
    let lat2Rad = Math.radians(lat2);
    // let lat2Rad = lat2.toRadians();
    let diffLatRad = Math.radians(lat2-lat1);
    let diffLonRad = Math.radians(lon2-lon1);

    let a = Math.sin(diffLatRad/2) * Math.sin(diffLatRad/2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(diffLonRad/2) * Math.sin(diffLonRad/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

let start = Date.now();

for (let i = 0; i < 1000000; i++) {
    harversineDistance(6.819545, 79.880083, 6.822551500000001, 79.8784496);
    // console.log(i, harversineDistance(6.819545, 79.880083, 6.822551500000001, 79.8784496));
}

console.log(Date.now() - start);

// store lat, long values of stores in a table and index that
// when an api request comes, calculate the adjustment to the lat and long values
// query the db with the correct range of values to get the stores within range
