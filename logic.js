
// read in data
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Define the marker size based on the size of the earthquake
function markerSize(mag) {
  return mag * 10000;
}

//Setting up colors to define magnitude size
function markerColor(mag) {
  if (mag <= 1) {
      return "white";
  } else if (mag <= 2) {
      return "blue";
  } else if (mag <= 3) {
      return "green";
  } else if (mag <= 4) {
      return "yellow";
  } else if (mag <= 5) {
      return "orange";
  } else {
      return "red";
  };
}

// Perform a GET request and create data feature function
d3.json(URL, function(data) {
  console.log(data);
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Creating a popup that provides the place, time, and magnitude of the earthquake when a marker is clicked
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3><center>" + feature.properties.place +
      "</center></h3><hr><p><center>" + new Date(feature.properties.time) + "</center></p>" + "<p><center> Magnitude: " +  feature.properties.mag + "</center></p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: .75,
        stroke: false,
    })
  }
  });
    
 // Place earthquake info on map
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satelitemap layers
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Create the map
  var myMap = L.map("map", {
    center: [28.0339,1.6596],
    zoom: 3,
    layers: [satelitemap, earthquakes]
    });
  
  //Create legend on the bottom right of screen
  //Legend will match the color and size of the earthquakes 
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend');
          lables = ["<strong>Earthquake Magnitude</strong>"],
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
          labels.push(
              '<i class="circle" style="background:' + markerColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + '));
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}

