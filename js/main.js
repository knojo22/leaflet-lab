/* JavaScript by Jon Fok, 2017 */

var current = ""


//Initializing the function called when the script loads
function initialize(){
	createMap();
};

// Creating a function to instantiate the map with Leaflet
function createMap(){
  var map = L.map('mapid', {
    center: [47.602654,-122.329797],
    zoom: 11
  });

// Adding the OpenStreetMap base tilelayer
  L.tileLayer('https:api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia25vam8yMiIsImEiOiJjaXl2cW5xa3owMDF0MndwbjliM3cxZjFoIn0.sMpJ7AM4zm5NSPAAXmIVBQ', {
		  maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

//  Calling the getData function to operate
    getData(map);
};

// Defining the getData function to retrive the data Seattle_PublicTransportation geojson
// data and placing the data on the map
function getData(map){
	// Importing the GeoJSON data
  $.ajax("data/Seattle_PublicTransportation.geojson", {
    dataType: "json",
    success: function(response){
			var attributes = processData(response);
			createPropSymbols(response, map, attributes);
			createSequenceControls(map, attributes);
    }
  });
};

// Creating a function to add the circle markers for points features into the map
function pointToLayer(feature, latlng, attributes){
// Determing which attribute to visualize with the proportional symbols
	var attribute = attributes[0];
  current = attribute;
	console.log(attribute);

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
		//
		// var popupContent = "Census Tract: " + String(feature.properties.CensusTract);
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

// Creating a function to calculate the radius for each proportional symbol
function calcPropRadius(attValue){
// Creating variables for the scale factor (scaleFactor), the area with the
// scale factor (area) and the calculated radius based on the area (radius)
		var scaleFactor = 10;
		var area = attValue * scaleFactor;
		var radius = Math.sqrt(area/Math.PI);
		return radius;
	};

// Creating a function to process the data to create the attributes
function processData(data){
	var attributes = [];
	var properties = data.features[0].properties;
	for (var attribute in properties){
		if (attribute.indexOf("TotalWorkersPTPer")>-1){
			attributes.push(attribute);
		};
	};
	console.log(attributes);
	return attributes;
};

// Defining a function to create sequence controls
function createSequenceControls(map, attributes){
	$('#panel').append('<input class="range-slider" type="range">');

	$('.range-slider').attr({
		max: 4,
		min: 0,
		value: 0,
		step: 1
	});
	$('#panel').append('<button class="skip" id="reverse">Reverse</button>');
	$('#panel').append('<button class="skip" id="forward">Skip</button>');

// $('#reverse').html('<img src="img/reverse.png">');
// $('#forward').html('<img src="img/forward.png">');

// Creating event listeners for the sequence controls
	$('.skip').click(function(){
		var index = $('.range-slider').val();

		if ($(this).attr('id') == 'forward'){
			index++;
			index = index > 4 ? 0 : index;
		} else if ($(this).attr('id') == 'reverse'){
			index--;
			index = index < 0 ? 4 : index;
		};
		$('.range-slider').val(index);
		updatePropSymbols(map, attributes[index]);
	});

	$('.range-slider').on('input', function(){
		var index = $(this).val();
		updatePropSymbols(map, attributes[index]);
		});
};

// Defining a function to calculate the radius of each proportional symbol
function createPropSymbols(data,map,attributes){

// Creating the Leaflet GeoJSON layer and adding the layer to the map
  var all = L.geoJson(data, {
    pointToLayer: function(feature, latlng){
			return pointToLayer(feature, latlng, attributes);
		}
  }).addTo(map);

// Creating event listeners to create proportional symbols based upon the attributes

  $('#all').click(function(){
    map.eachLayer(function(layer){
      if (layer.setRadius && layer.feature.properties[current]){
        var r = calcPropRadius(layer.feature.properties[current])
        layer.setRadius(r)
      }
    });
  });

// Event listeners that add the data layer based upon the conditions and removes
// the data layers from the map.
  $('#ten').click(function(){
    map.eachLayer(function(layer){
      if (layer.setRadius && layer.feature.properties[current] > 10){
        layer.setRadius(0)
      }
			else if(layer.setRadius) {
				var radius = calcPropRadius(layer.feature.properties[current])
				layer.setRadius(radius)
			}
    });
  });

  $('#fifteen').click(function(){
    map.eachLayer(function(layer){
      if (layer.setRadius && layer.feature.properties[current] <= 10){
        layer.setRadius(0)
      }
      else if (layer.setRadius && layer.feature.properties[current] > 15){
        layer.setRadius(0)
      }
			else if(layer.setRadius){
				var radius = calcPropRadius(layer.feature.properties[current])
				layer.setRadius(radius)
			}
    });
  });

  $('#twenty').click(function(){
    map.eachLayer(function(layer){
      if (layer.setRadius && layer.feature.properties[current] <= 15){
        layer.setRadius(0)
      };
      if (layer.setRadius && layer.feature.properties[current] > 20){
        layer.setRadius(0)
      }
			else if(layer.setRadius){
				var radius = calcPropRadius(layer.feature.properties[current])
				layer.setRadius(radius)
			}
    });
  });

  $('#twentyplus').click(function(){
    map.eachLayer(function(layer){
      if (layer.setRadius && layer.feature.properties[current] <= 20){
        layer.setRadius(0)
      }
			else if(layer.setRadius){
				var radius = calcPropRadius(layer.feature.properties[current])
				layer.setRadius(radius)
			}
    });
  });
};

// Creating a function to update the proptional symbols for each of the data points
function updatePropSymbols(map, attribute){
  current = attribute;
  map.eachLayer(function(layer){
		if (layer.feature && layer.feature.properties[attribute]){
			var props = layer.feature.properties;
			var radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);

// Creating a popup for each of the data points with information
			var popupContent = "<p><b>Census Tract:</b> " + props.CensusTract + "</p>";
			var year = attribute.split("_")[1];
			popupContent += "<p><b>Percentage of Work Commutes by Public Transportation in " + year + ":</b> " + props[attribute]+ " %</p>";

			layer.bindPopup(popupContent, {
				offset: new L.Point(0,-radius)
			});
		};
	});
};

$(document).ready(initialize);
