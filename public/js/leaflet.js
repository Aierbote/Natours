export const displayMap = (locations) => {
  // adding the map to the `div#map`
  // set up the map without zoom Control`
  const map = L.map('map', {
    zoomControl: false,
    dragging: false,
    doubleClickZoom: false,
  });

  // adding a tile to the map, the default choice in the Leaflet Documentation
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Create icon using the image provided by Jonas
  const greenIcon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [32, 40], // size of the icon
    iconAnchor: [16, 45], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -50], // point from which the popup should open relative to the iconAnchor
  });

  // Add locations to the map
  const points = [];
  locations.forEach((loc) => {
    // Create points
    points.push([loc.coordinates[1], loc.coordinates[0]]);

    // Add markers
    L.marker([loc.coordinates[1], loc.coordinates[0]], { icon: greenIcon })
      .addTo(map)
      // Add popup
      .bindPopup(`<h2>Day ${loc.day}: ${loc.description}</h2>`, {
        autoClose: false,
      })
      .openPopup();
  });

  // Set map bounds to include current location
  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);

  // Disable scroll on map
  map.scrollWheelZoom.disable();
};
