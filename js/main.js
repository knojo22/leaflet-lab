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

		// Calling the getData function to operate
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
			createLegend(map, attributes);
    }
  });
};

// Defining a function to add the circle markers for points features into the map
function pointToLayer(feature, latlng, attributes){
	// Determing which attribute to visualize with the proportional symbols
	var attribute = attributes[0];
  current = attribute;
	console.log(attribute);

	// Creating the marker options
	var MarkerOptions = {
		radius: 3,
		fillColor: "#2b8cbe",
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

		// Calling the popup content function and binding the popup to the cirlce marker
		var popup = new Popup(feature.properties, attribute, layer, MarkerOptions.radius);

		popup.bindToLayer();

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

// Defining a function to calculate the radius for each proportional symbol
function calcPropRadius(attValue){
	/* Creating variables for the scale factor (scaleFactor), the area with the
	scale factor (area) and the calculated radius based on the area (radius) */
		var scaleFactor = 20;
		var area = attValue * scaleFactor;
		var radius = Math.sqrt(area/Math.PI);
		return radius;
	};

// Defining a function to create the popup content for the markers
function Popup(properties, attribute, layer, radius){
	// Building the popup content string and binding the popup to the cirlce marker
		this.properties = properties;
		this.attribute = attribute;
		this.layer = layer;
		this.year = attribute.split("_")[1];
		this.publictransportation = this.properties[attribute]
		this.content = "<p><b>Census Tract: </b>" + this.properties.CensusTract + "<p><b>Work Commutes by Public Transportation (%):</b> " + this.publictransportation + " %</p>";

		this.bindToLayer = function(){
			this.layer.bindPopup(this.content, {
				offset: new L.Point(0, -radius),
				closeButton: false
			});
		};
};

// Defining a function to process the data to create the attributes
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

// Defining a function to update the proptional symbols for each of the data points
function updatePropSymbols(map, attribute){
  current = attribute;
  map.eachLayer(function(layer){
		if (layer.feature && layer.feature.properties[attribute]){
			var props = layer.feature.properties;
			var radius = calcPropRadius(props[attribute]);
			layer.setRadius(radius);
			// Using a variable "popup2" to create a popup based upon the first ('popup')
			var popup = new Popup(props, attribute, layer, radius);
			var popup2 = Object.create(popup);
			popup2.content = "<p><b>Census Tract: </b>" + popup.properties.CensusTract + "<p><b>Percentage of Work Commutes: </b>" + popup.publictransportation +"%</p>"
			// Binding the popup to the circle marker
			popup2.bindToLayer();
		};
	});
};

// Defining a function to operate as a temporal legend
function createLegend(map, attributes){
	var LegendControl = L.Control.extend({
		options: {
			position: 'bottomright'
		},

		onAdd: function(map){
			// Creating a container for the legend control
			var container = L.DomUtil.create('div', 'legend-control-container');
			$(container).append('<div id = "temporal-legend">');

			var svg = '<svg id="attribute-legend" width="160px" height="70px">';

			var circles = {
				max: 25,
				mean: 37.5,
				min: 50
			};
			// Creating a "for" loop to add each circle and text into a svg string
			for (var circle in circles){
				// Creating a circle string
				svg += '<circle class="legend-circle" id="' + circle + '" fill="#2b8cbe" fill-opacity="0.8" stroke="#000000" cx="30"/>';

				// Creating a text string
				svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
			};

			svg += "</svg>";
			$(container).append(svg);

			return container;
		}
	});
	map.addControl(new LegendControl());
	updateLegend(map, attributes[0]);
};

// Defining a function to calculate the min, mean and max values for the given attribute
function getCircleValues(map, attribute){
	var min = Infinity, max = -Infinity;

	// Using the function to get the attribute value from the layer
	map.eachLayer(function(layer){
		if (layer.feature){
			var attributeValue = Number(layer.feature.properties[attribute]);
			if (attributeValue < min){
				min = attributeValue;
			};

			if (attributeValue > max){
				max = attributeValue;
			};
		};
	});

	// Returning the values as an object
	var mean = (max+min)/2;
	return {
		max: max,
		mean: mean,
		min: min
	};
};

// Defining a function to update the legend after using the sequence slider
function updateLegend(map, attribute){
	var year = attribute.split("_")[1];
	var content = "Work Commutes by Public Transportation in " + year + " [%]";

	// Replacing the legend content after clicking on the sequence control
	$('#temporal-legend').html(content);

	var circleValues = getCircleValues(map, attribute);
	for (var key in circleValues){
		var radius = calcPropRadius(circleValues[key]);
		$('#'+key).attr({
			cy: 50 - radius,
			r: radius
		});

		$('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + " %");
	};
	console.log(circleValues);
};


// Defining a function to operate the sequence control slider
function createSequenceControls(map, attributes){
	var SequenceControl = L.Control.extend({
		options: {
			position: 'bottomleft'
		},

			onAdd: function (map){
				// Creating a control container for the sequence control slider
				var container = L.DomUtil.create('div', 'sequence-control-container');
				$(container).append('<input class="range-slider" type="range">');
				$(container).append('<button class="skip" id="reverse" title="Reverse"><b>Previous Year</b></button>');
				$(container).append('<button class="skip" id="forward" title="Forward"><b>Next Year</b></button>');

				return container;
			}
	});

		map.addControl(new SequenceControl());
		// Preventing any mouse event listeners on the map to occur
		$('.range-slider').on('mousedown dblclick', function(e){
			L.DomEvent.stopPropagation(e);
		});
		$('#reverse').html('<img src="img/reverse.png">');
		$('#forward').html('<img src="img/forward.png">');
		$('.range-slider').attr({'type':'range',
												'max': 4,
												'min': 0,
												'step': 1,
												'value': 0
											});
		$('.skip').on('mousedown dblclick', function(e){
			L.DomEvent.stopPropagation(e);
		});
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
			updateLegend(map, attributes[index]);
		});
};

$(document).ready(initialize);
