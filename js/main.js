/* JavaScript by Jon Fok, 2017 */

//Initializing the function called when the script loads
function initialize(){
	createMap();
};

// Creating a function to instantiate the map with Leaflet
function createMap(){
  var map = L.map('mapid', {
    center: [47.602654,-122.329797],
    zoom: 10
  });

// Adding the OpenStreetMap base tilelayer
  L.tileLayer('https:api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia25vam8yMiIsImEiOiJjaXl2cW5xa3owMDF0MndwbjliM3cxZjFoIn0.sMpJ7AM4zm5NSPAAXmIVBQ', {
		  maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

//  Calling the getData function to operate
    getData(map);
};

// Creating a function to calculate the radius for each proportional symbol
function calcPropRadius(attValue){
// Creating variables for the scale factor (scaleFactor), the area with the
// scale factor (area) and the calculated radius based on the area (radius)
		var scaleFactor = 10;
		var area = attValue * scaleFactor;
		var radius = Math.sqrt(area/Math.PI);
		return radius;
	};
// Creating a function to add the circle markers for points features into the map
function pointToLayer(feature, latlng){

// Determing which attribute to visualize with the proportional symbols
	var attribute = "TotalWorkersPTPer_2015";

// Creating the marker options
	var MarkerOptions = {
		radius: 3,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
		};

// Creating a variable to determine the value for each feature based on the
// selected attribute
		var attValue = Number(feature.properties[attribute]);

// Creating the circle marker for each feature based on the attribute value
		MarkerOptions.radius=calcPropRadius(attValue);
// Creating a circle marker layer
		var layer = L.circleMarker(latlng, MarkerOptions);

// Building the popup content string and binding the popup to the cirlce marker
		var popupContent = "<p><b>Census Tract: </b>" + feature.properties.CensusTract + "</p>"
		var year = attribute.split("_")[1];
		popupContent += "<p><b>Percentage of Work Commutes by Public Transportation in " + year + ":</b> " + feature.properties[attribute]+ " %</p>";
		layer.bindPopup(popupContent, {
// Creating an offset to each circle marker
			offset: new L.Point(0,-MarkerOptions.radius),
			closeButton: false
		});

// Creating event listeners to open the popup on hover
		layer.on({
			mouseover: function(){
				this.openPopup();
			},
			mouseout: function(){
				this.closePopup();
			}
		});
		return layer;
}

// Adding the circle markers for the point features in the map
function createPropSymbols(data,map){
// Defining a function to calculate the radius of each proportional symbol

// Creating the Leaflet GeoJSON layer and adding the layer to the map
    L.geoJson(data, {
      pointToLayer: pointToLayer
    }).addTo(map);
};

// Defining the getData function to retrive the data MegaCities geojson
// data and placing the data on the map
function getData(map){
// Importing the GeoJSON data
  $.ajax("data/Seattle_PublicTransportation.geojson", {
    dataType: "json",
    success: function(response){
			createPropSymbols(response, map);
    }
  });
};

$(document).ready(initialize);
