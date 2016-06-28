cartodbApp.controller('DrivingDirectionsController' , function($scope) {

    var sf_public_schools_viz_json = 'https://jescacena.cartodb.com/api/v2/viz/658c7888-3d3d-11e6-b4d5-0ea31932ec1d/viz.json';


    $scope.load = function () {

      // Create services for later rendering of directions
      var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();


      // The location of the Exploratorium
      var exploratorium = new google.maps.LatLng(37.801434, -122.397561);


      // Map center
      var myLatlng = new google.maps.LatLng(37.753, -122.433);

      // Map options
      var myOptions = {
          zoom: 13,
          center: myLatlng,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      // Render basemap
      map = new google.maps.Map(document.getElementById("map"), myOptions);

      directionsDisplay.setMap(map);

      cartodb.createLayer(map, sf_public_schools_viz_json)
        .addTo(map)
        .done(function(layers) {

            var subLayer = layers.getSubLayer(0);

            subLayer.setInteraction(true); // Interaction for the layer must be enabled

            // Setup our event when an object is clicked
            layers.on('featureClick', function(e, latlng, pos, data){
              // the location of the clicked school
              var school = new google.maps.LatLng(latlng[0], latlng[1]);

              // our DirectionsRequest
              var request = {
                  origin : school,
                  destination : exploratorium,
                  travelMode : google.maps.TravelMode.DRIVING
              };

              // use route method to generate directions
              directionsService.route(request, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
                  }
              });

            });
        });

    };
});
