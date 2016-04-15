cartodbApp.controller('example1Controller', function($scope){
    $scope.load = function () {
        
    var options = {
      center: [40.4000, -3.6833], // Madrid
      zoom: 10,
      scrollwheel: true
    };        
        
        //alert("load event detected!");
        cartodb.createVis("map", 
                          "https://jescacena.cartodb.com/api/v2/viz/75c88d52-ea9c-11e5-86f9-0ecd1babdde5/viz.json",
                         options);
//        cartodb.createVis("map", "http://127.0.0.1:64260/src/cartodbjs-example-tutorials/json/viz.json");
//        cartodb.createVis("map", 'http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json');
    }
});