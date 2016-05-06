cartodbApp.controller('CartoSqlSelectorController' , function($scope) {

    var tableName = "earthquakes_week";

    // Instantiate new map object, place it in 'map' element
    var map_object = new L.Map('map', {
        center: [37.7741154,-122.4437914], // San Francisco
        zoom: 4
    });

    $scope.load = function () {

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
      var condition = ""; // SQL or CartoCSS string
      var $options = $(".layer_selector").find("li");
      $options.click(function(e) {
        var $li = $(e.target);
        var selected = $li.attr('data');
        var type = $li.data('type'); // 'sql' or 'cartocss'

        if (type === "cartocss") { // if a CartoCSS selector is chosen, set the style
          $options.removeClass('cartocss_selected');
          if (selected !== "simple") {
            $li.addClass('cartocss_selected');
          }

          condition = $('#'+selected).text();
          layer.setCartoCSS(condition);
        } else { // if a SQL selector is chosen, re-query the data
          $options.removeClass('sql_selected');
          if (selected !== "") {
            $li.addClass('sql_selected');
          }

          layer.setSQL("SELECT * FROM " + tableName + selected);

            if (selected.indexOf('guinea') !== -1) {
              map_object.setView([-9.5, 147.116667],6);
            }
        }
      });
    }

});
