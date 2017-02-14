// Creating a function to instantiate the map with Leaflet
function createMap(){
  var map = L.map('mapid', {
    center: [20,0],
    zoom: 2
  });

// Adding the OpenStreetMap base tilelayer
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

//  Calling the getData function to operate
    getData(map);
};

// Defining a function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
// Creating a HTML string with all of the properties
  var popupContent = "";
  if (feature.properties) {
// Creating a loop to add feature property names and values to the html string
    for (var property in feature.properties){
      popupContent += "<p>" + property + ":" + feature.properties[property] + "</p>";
    }
    layer.bindPopup(popupContent);
  }
}

// Defining the getData function to retrive the data MegaCities geojson
// data and placing the data on the map
function getData(map){
// Loading the MegaCities data
  $.ajax("data/MegaCities.geojson", {
    dataType: "json",
    success: function(response){
// Creating marker options
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

// Creating the Leaflet GeoJSON layer and adding the layer to the map
      L.geoJson(response, {
        pointToLayer: function (feature,latlng){
          return L.circleMarker(latlng,geojsonMarkerOptions);
        },
        onEachFeature: onEachFeature
      }).addTo(map);
    }
  });
}

$(document).ready(createMap)
