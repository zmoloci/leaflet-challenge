// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
let baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};


// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
  center: [
    10.09, -70.71
  ],
  zoom: 5,
  layers: [street, topo]
});


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Send data to console for troubleshooting.
  console.log(data)
  console.log(data.features[0])


    // Looping through the cities array, create one marker for each city, bind a popup containing its location description, date of record, magnitude and focus depth
    // and add it to the map.
  for (let i = 0; i < data.features.length; i++) {
  // Send the Earthquake Focus Depth to a variable
  quakeDepth = data.features[i].geometry.coordinates[2]
  // Assign a colour to each marker based on the Earthquake Focus Depth value:
  if (quakeDepth > 160){depthColor = "#2c3031"}
  else if (quakeDepth > 70){depthColor = "#3c6a89"}
  else if (quakeDepth > 40){depthColor = "#7e510d"}
  else if (quakeDepth > 20){depthColor = "#dd821a"}
  else {depthColor = "#32CD32"}
  // Declare variable for the features dictionary within the GeoJSON
  let quake = data.features[i];
  // Create a circle centered on the lat/long found in the dataset
  L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], {
    // a 50% fill opacity allows other circles/datapoints to show through
    fillOpacity: 0.5,
    // colour is based on Earthquake Focus Depth
    color: depthColor,
    fillColor: depthColor,
    // the radius of the given circle is based on the (magnitude of the measured Earthquake ^ 2) * 10000
    // this gives visual priority to more intense (higher magnitude) earthquakes
    radius: (Math.pow(quake.properties.mag,2) * 10000)
    // Popup containing its location description, date of record, magnitude and focus depth
  }).bindPopup(`<h1>${quake.properties.place} </p></h1> <hr> <h3> Date: ${Date(quake.properties.time)}</h3></p><h3>Magnitude: ${quake.properties.mag.toLocaleString()}</p>Depth: ${quake.geometry.coordinates[2].toLocaleString()}</h3>`).addTo(myMap);
  }
});


 
function updateLegend(baseMaps, myMap) {

  // Create a layer control.
  // Pass it our baseMaps variable containing topo and street maps
  // Add the layer control to the map.
  L.control.layers(null, baseMaps, {
    collapsed: false
  }).addTo(myMap);

  // Create a legend to display information about our map.
  var legend = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend")
    div.innerHTML=[
      // A title and visual key to the Earthquake Focus Depths in km is seen here
      // See the style.css sheet for custom css styling to match the circle colours displayed on the map
      "<h2>Earthquake Focus Depth (km)</h2>",
      "<p class='0t20'>0 to 20</p>",
      "<p class='20t40'>21 to 40</p>",
      "<p class='40t70'>41 to 70</p>",
      "<p class='71t160'>71 to 160</p>",
      "<p class='g160'>> 160</p>"
    ].join("");
    return div;
    };
    // Add the info legend to the map.
    legend.addTo(myMap)
    console.log("updateLegend?")
};

// The legend can load before the d3 call is complete
updateLegend(baseMaps, myMap);