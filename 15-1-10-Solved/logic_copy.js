// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
console.log(data)


    // Looping through the cities array, create one marker for each city, bind a popup containing its name and population, and add it to the map.
for (let i = 0; i < data.features.length; i++) {
  quakeDepth = data.features[i].geometry.coordinates[2]
  if (quakeDepth > 160){depthColor = "#2c3031"}
  else if (quakeDepth > 70){depthColor = "#3c6a89"}
  else if (quakeDepth > 40){depthColor = "#7e510d"}
  else if (quakeDepth > 20){depthColor = "#dd821a"}
  else {depthColor = "#48e317"}
  let quake = data.features[i];
  L.circle([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], {
    fillOpacity: 0.5,
    color: depthColor,
    fillColor: depthColor,
    radius: (Math.pow(quake.properties.mag,2) * 10000)
  }).bindPopup(`<h1>${quake.properties.place}</h1> <hr> <h3>Magnitude: ${quake.properties.mag.toLocaleString()}</h3></br><h3>Depth: ${quake.geometry.coordinates[2].toLocaleString()}</h3>`).addTo(myMap);
}});


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
      22.09, -105.71
    ],
    zoom: 5,
    layers: [street]
  })

 

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);