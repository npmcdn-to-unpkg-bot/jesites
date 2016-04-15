cartodbApp.controller('example2Controller', function($scope){
    $scope.load = function () {
        
    // Choose center and zoom level
      var options = {
        center: [40.4000, -3.6833], // Madrid
        zoom: 10
      }

      // Instantiate map on specified DOM element
      var map_object = new L.Map("map", options);

      // Add a basemap to the map object just created
      L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
      }).addTo(map_object);
        
        cartodb.createLayer(map_object, "https://jescacena.cartodb.com/api/v2/viz/75c88d52-ea9c-11e5-86f9-0ecd1babdde5/viz.json").addTo(map_object);
    }
        
});
