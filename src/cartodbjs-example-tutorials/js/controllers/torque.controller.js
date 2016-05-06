cartodbApp.controller('TorqueController' , function($scope) {
  var tableName = "armed_conflic_africa_1997_2014";

  // Instantiate new map object, place it in 'map' element (Africa)
  var map_object = new L.Map('map', {
      center: [21.181640624999996,5.79089681287197], // Africa
      zoom: 4,
      scrollWheelZoom: false
  });

    $scope.load = function () {
      // setup layer
        var layerSource = {
          type: 'torque',
          options: {
            user_name: 'jescacena', // replace with your user name
            table_name: 'armed_conflic_africa_1997_2014',
            cartocss: $("#cartocss").html()
          }
        }

        var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        });

        map_object.addLayer(layer);

        // put torque layer on top of basemap
        cartodb.createLayer(map_object, layerSource)
          .addTo(map_object)
          .done(function(layer) {
            // do stuff
            var torqueLayer = layer;
            torqueLayer.pause();
            torqueLayer.on('load', function() {
                torqueLayer.play();
            });
            // pause animation at last frame
            torqueLayer.on('change:time', function(changes) {
                if (changes.step === torqueLayer.provider.getSteps() - 1) {
                    torqueLayer.pause();
                }
            });

          })
          .error(function(err) {
            console.log("Error: " + err);
          });

    };
});

/*
*/
