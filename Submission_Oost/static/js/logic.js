// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
// Create the map object with center and zoom options.
// Then add the 'basemap' tile layer to the map.
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.
// Step 1: CREATE THE BASE LAYERS
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//Gets the marker color based on the depth
  function getColor(depth) {
    let color = "purple";

    // If statement on color
    if (depth >90) {
      color = "#ea193d";
    } else if (depth >70) {
      color = "#ff6127";
    } else if (depth > 50) {
      color = "#ffff00";
    } else if (depth > 30) {
      color = "#37410f";
    } else if (depth > 10) {
      color = "#0000ff";
    } else {
      color = "#330077";
    }
    return color;
  }

//Function to get the radius from magnitude
  function getMag(mag) {
    return mag * 3;
  }


let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
let plateUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

d3.json(queryUrl).then(function (data) {
  d3.json(plateUrl).then(function (plate_data) {

    // Step 2: CREATE THE DATA/OVERLAY LAYERS
    console.log(data);

    //loop through the earthquakes
    let markers = []

    for (let i =0; i <data.features.length; i++) {
      let row = data.features[i];
      let location = row.geometry.coordinates;
      if (location) {
        let latitude = location[1];
        let longitude = location [0];
        let depth = location [2];
        let mag = row.properties.mag;


      //Circle Marker

      marker = L.circleMarker([latitude, longitude],{
        fillOpacity: 0.75,
        color: "black",
        fillColor: getColor(depth),
        radius: getMag(mag)
      }).bindPopup(`<h1>${row.properties.title}</h1> `);
      markers.push(marker)
      }

    }

  let markerLayer = L.layerGroup(markers);

    //Create Techtonic plate layer
    let geoLayer = L.geoJSON(plate_data);
  

    // Step 3: CREATE THE LAYER CONTROL
    let baseMaps = {
      Street: street,
      Topography: topo
    };

    let overlayMaps = {
      Earthquakes: markerLayer,
      TectonicPlates: geoLayer
    };


    // Step 4: INITIALIZE THE MAP
    let myMap = L.map("map", {
      center: [46.2276, 2.2137],
      zoom: 3,
      layers: [street, markerLayer]
    });

    // Step 5: Add the Layer Control, Legend, Annotations as needed
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  })

});





//   // OPTIONAL: Step 2
//   // Make a request to get our Tectonic Plate geoJSON data.
//   d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
//     // Save the geoJSON data, along with style information, to the tectonic_plates layer.


//     // Then add the tectonic_plates layer to the map.

//   });
// });
