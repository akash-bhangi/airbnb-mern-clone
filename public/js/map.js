const map = L.map("map");

// Use the coordinates variable defined in the EJS file
let mapCoordinates = [12.9716, 77.5946];
if (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2) {
    mapCoordinates = [listing.geometry.coordinates[1], listing.geometry.coordinates[0]];
}
map.setView(mapCoordinates, 13);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);
