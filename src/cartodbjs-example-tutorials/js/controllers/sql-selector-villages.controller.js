cartodbApp.controller('VillagesSqlSelectorController' , function($scope, $timeout) {


      var sublayer0Shown = true;
      // For storing the sublayers
      var sublayers = [];
      var subLayerShown = {
          larger100k:true,
          larger100k_women:false
      };

      var mapLayerIds = {
          larger100k:0,
          larger100k_women:1,
          larger100k_men:2
      };

      var layerData;

      //Layers SQL sources from CartoDB datasets
      var layerSource = {
        user_name: 'jescacena',
        type: 'cartodb',
        sublayers: [
//              {
//            sql: "SELECT * FROM comarcas",
//            cartocss: '/** simple visualization */ #comarcas{  polygon-fill: #FF6600;  polygon-opacity: 0.7;  line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}'
//          },
        {
          id: "larger100k",
          sql: "SELECT * FROM pueblos_espana where habitantes > 100000",
          cartocss: '/** simple visualization */ #pueblos_espana{  marker-fill-opacity: 0.9;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-placement: point;  marker-type: ellipse;  marker-width: 10;  marker-fill: #FF6600;  marker-allow-overlap: true;}'
        },
        {
          id: "larger100k_women",
          sql: "SELECT * FROM pueblos_espana where habitantes > 100000 and mujeres > hombres",
          cartocss: '/** simple visualization */ #pueblos_espana{  marker-fill-opacity: 0.9;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-placement: point;  marker-type: ellipse;  marker-width: 10;  marker-fill: #A53ED5;  marker-allow-overlap: true;}'
        },
        {
          id: "larger100k_men",
          sql: "SELECT * FROM pueblos_espana where habitantes > 100000 and hombres > mujeres",
          cartocss: '/** simple visualization */ #pueblos_espana{  marker-fill-opacity: 0.9;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-placement: point;  marker-type: ellipse;  marker-width: 10;  marker-fill: #5CA2D1;  marker-allow-overlap: true;}'
        }]
      }

  $scope.load = function() {

      //CartoDB Map centered in Madrid
      var map_object = new L.Map('map', {
          center: [40.4000, -3.6833], // Madrid
          zoom: 4
      });

      // For storing the sublayer
      var sublayer;

      L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map_object);

      // Add data layer to your map
      cartodb.createLayer(map_object,layerSource)
        .addTo(map_object)
        .done(function(layer) {

          for (var i = 0; i < layer.getSubLayerCount(); i++) {
            sublayers[i] = layer.getSubLayer(i);
          }

          //Set style for aps1314 initially
          var layerData = getSublayerData('larger100k');
          sublayers[mapLayerIds['larger100k']].setCartoCSS(layerData.cartocss);
          layerData = getSublayerData('larger100k_women');
          sublayers[mapLayerIds['larger100k_women']].setCartoCSS(layerData.cartocss);
          layerData = getSublayerData('larger100k_men');
          sublayers[mapLayerIds['larger100k_men']].setCartoCSS(layerData.cartocss);

          //Initial layers display
          sublayers[mapLayerIds['larger100k']].show();
          sublayers[mapLayerIds['larger100k_women']].hide();
          sublayers[mapLayerIds['larger100k_men']].hide();

          createSelector();

          cartodb.vis.Vis.addInfowindow(map_object, sublayers[mapLayerIds['larger100k']], ['poblacion', 'provincia' , 'habitantes', 'mujeres' , 'hombres']);
          cartodb.vis.Vis.addInfowindow(map_object, sublayers[mapLayerIds['larger100k_men']], ['poblacion', 'provincia' , 'habitantes', 'mujeres' , 'hombres']);
          cartodb.vis.Vis.addInfowindow(map_object, sublayers[mapLayerIds['larger100k_men']], ['poblacion', 'provincia' , 'habitantes', 'mujeres' , 'hombres']);
        })
        .error(function(err) {
          console.log("error: " + err);
        });



  };


  // Create layer selector onclick listeners
  function createSelector(layer) {
    var condition = ""; // SQL or CartoCSS string
    var $options = $(".layer_selector").find("li");
    $options.on("click", function(e) {
      var $li = $(e.currentTarget);
      var selected = $li.attr('data');
      if (selected==='reset') {
        $li=$('li[data="larger100k"]');
        selected='larger100k';
      }
      var type = $li.data('type'); // 'sql' or 'cartocss'

      if (type === "cartocss") { // if a CartoCSS selector is chosen, set the style
        $options.removeClass('cartocss_selected');
        if (selected !== "simple") {
          $li.addClass('cartocss_selected');
        }

        condition = $('#'+selected).text();
        layer.setCartoCSS(condition);

      } else { // if a SQL selector is chosen, re-query the data

        var layerData = getSublayerData(selected);
        $options.removeClass('sql_selected');
        if (selected !== "") {
          $li.addClass('sql_selected');
        }

        sublayers[mapLayerIds['larger100k']].hide();
        sublayers[mapLayerIds['larger100k_women']].hide();
        sublayers[mapLayerIds['larger100k_men']].hide();

        $timeout(function() {
          sublayers[mapLayerIds[selected]].show();
        },50);

      }
    });
  }

  function getSublayerData(sublayerId) {
    var layers = layerSource.sublayers;

    for (var i in layers) {
      if(layers[i].id===sublayerId) {
        return layers[i];
      }
    }

    return null;
  }
});
