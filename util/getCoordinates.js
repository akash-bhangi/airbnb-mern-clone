const axios = require("axios");

//Function to get coordinates
async function getCoordinates(place) {

    const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
            params: {
                q: place,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "AirbnbClone/1.0"
            }
        }
    );
    return response;
}

module.exports.getCoordinates = getCoordinates;