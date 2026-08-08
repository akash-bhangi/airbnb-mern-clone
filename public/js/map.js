const mapElement = document.getElementById("map");
const coordinates = JSON.parse(mapElement.getAttribute("data-coordinates"));
const title = mapElement.getAttribute("data-title");
const locationName = mapElement.getAttribute("data-location");
const price = mapElement.getAttribute("data-price");

const map = L.map("map");

// Use the coordinates variable defined in the EJS file
let mapCoordinates = [12.9716, 77.5946];
if (coordinates && coordinates.length === 2) {
    mapCoordinates = [coordinates[1], coordinates[0]]; // Leaflet uses [lat, lon]
}
console.log("mapCoordinates: ", mapCoordinates);
map.setView(mapCoordinates, 13);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

// Add marker
L.marker(mapCoordinates)
    .addTo(map)
    .bindPopup(`<b>${title}</b><br>${locationName}<br>&#8377; ${parseFloat(price).toLocaleString("en-IN")}/night`)
    .openPopup();
