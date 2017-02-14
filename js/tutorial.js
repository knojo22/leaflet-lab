var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//Adding the tile layer for the map
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia25vam8yMiIsImEiOiJjaXl2cW5xa3owMDF0MndwbjliM3cxZjFoIn0.sMpJ7AM4zm5NSPAAXmIVBQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'knojo22',
    accessToken: 'pk.eyJ1Ijoia25vam8yMiIsImEiOiJjaXl2cW5xa3owMDF0MndwbjliM3cxZjFoIn0.sMpJ7AM4zm5NSPAAXmIVBQ'
}).addTo(mymap);

// Adding a Marker to the Map
var marker = L.marker([51.5, -0.09]).addTo(mymap);

// Adding a circle object to the Map
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);
// Adding a polygon to the Map
var polygon = L.polygon([
  [51.509,-0.08],
  [51.503,-0.06],
  [51.51,-0.047]
]).addTo(mymap);

// Creating popups for the marker, circle & polygon
marker.bindPopup("<b>Hello World!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon");

// Creating popups as layers
// Using openOn because the command handles automatic closing of a previously
// opened popup which is good for stability.
var popup = L.popup()
  // .setLatLng([51.5,-0.09])
  // .setContent("I am a standalone popup.")
  // .openOn(mymap);

// Defining a function for a popup to appear showing the coordinates where the
// user clicked on the map.
function onMapClick(e) {
  popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(mymap);
}
mymap.on('click', onMapClick);
