cartodbApp.controller('CartoCssSelectorController' , function($scope) {
    
    var layerSource = {
      user_name: 'jescacena', 
      type: 'cartodb',
      sublayers: [{ 
        sql: "SELECT * FROM earthquakes_cdbjs_lesson3", // Earthquakes from the past 30 days
        cartocss: '#all_day{marker-fill-opacity:0.9;marker-line-color:FFF;marker-line-width: 1.5;marker-line-opacity: 1;marker-placement: point;marker-type: ellipse;marker-width: 10;marker-fill: #FF6600;marker-allow-overlap: true;}' // Simple visualization
      }]
    }
    
    
    
    $scope.load = function () {
        
        var tableName = "earthquakes_week";

        // Put layer data into a JS object
        var layerSource = {
          user_name: 'jescacena', 
          type: 'cartodb',
          sublayers: [{ 
            sql: "SELECT * FROM " + tableName, // All recorded earthquakes past 30 days
            cartocss: $("#simple").text() // Simple visualization
          }]
        }

        // For storing the sublayer
        var sublayer;

        // Instantiate new map object, place it in 'map' element
        var map_object = new L.Map('map', {
          center: [37.7741154,-122.4437914], // San Francisco
          zoom: 4
        });

        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map_object);

        // Add data layer to your map
        cartodb.createLayer(map_object,layerSource)
          .addTo(map_object)
          .done(function(layer) {
            sublayer = layer.getSubLayer(0);
            createSelector(sublayer);
          })
          .error(function(err) {
            console.log("error: " + err);
          });     

    };
    
    // Create layer selector
    function createSelector(layer) {
      var cartocss = "";
      var $options = $(".layer_selector").find("li");
      $options.click(function(e) {
        var $li = $(e.target);
        var selected = $li.attr('data');

        //Remove selected from all options
        $options.removeClass('cartocss_selected');
        
        //Set selected in one clicked
        $li.addClass('cartocss_selected');

        //Set style for option selected
        cartocss = $('#'+selected).text();
        layer.setCartoCSS(cartocss);
      });
    }    
    
});
