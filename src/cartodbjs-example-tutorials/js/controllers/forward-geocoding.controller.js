cartodbApp.controller('ForwardGeocodingController', function($scope,
  $compile,
  $rootScope,
  $timeout){

    var map_object;
    var options = {
      center: [40.4000, -3.6833], // Madrid
      zoom: 7
    };

    var cartodbSublayer;
    var cartodbSQL = new cartodb.SQL({ user: 'jescacena' });

    $scope.load = function () {
      // Instantiate map on specified DOM element
      map_object = new L.Map("map", options);

      // Add a basemap to the map object just created
      L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
      }).addTo(map_object);

      cartodb.createLayer(map_object,
        "https://jescacena.cartodb.com/api/v2/viz/75c88d52-ea9c-11e5-86f9-0ecd1babdde5/viz.json")
        .addTo(map_object)
        .done(function(layer) {
          cartodbSublayer = layer.getSubLayer(0);
        });

    };

    var showMap = function(point) {

        console.log("point" , point);

        var latLng = new L.LatLng(point.lat, point.lon);
        map_object.setView(latLng,18);

        //compila popup
        var popupContent = angular.element('#popupAddress');
        L.marker([point.lat, point.lon],{clickable:true , title: $scope.address})
              .bindPopup(popupContent.html())
              .addTo(map_object)
              .openPopup();

        $scope.lat = point.lat;
        $scope.lon = point.lon;
        $compile( $('.leaflet-popup-pane').contents() )($scope);

        console.log("lat" , $scope.lat);
        console.log("lon" , $scope.lon);

        $scope.showPopup = true;

    };

    $scope.geocode = function() {
      console.log("Address-->" , $scope.address);
      $scope.showPopup = true;

      //TODO Invoke geocode.xyz service
      // http://geocode.xyz/1%20VOLATERIA%20Plaza,%20el%20Prat%20de%20Llobregat?geoit=json
      $.ajax({
        url: 'http://geocode.xyz/'+encodeURI($scope.address)+'?geoit=json',
        success: function(data) {
          console.log("geocode response-->", data);

          //TODO On callback get point and show map
          $scope.$apply(function() {
            $timeout(function(){
              $scope.lat = data.latt;
              $scope.lon = data.longt;
              showMap({lat:data.latt , lon:data.longt});
            },100);
          });

        },
        error: function() {
          cdb.log.info('oh no!, check your json location or if you are using a web server (Apache?)')
        }
      });
    };


    $scope.getNearest = function() {
      console.log("getNearest-->" , $scope.lat,$scope.lon);
      console.log("getNearest map_object-->" , map_object);

      //hacer un layerSource para invocar el create Layer de CartoDB
      //En 5km a la redonda
      var layerSource = {
        user_name: 'jescacena',
        type: 'cartodb',
        sublayers: [
              {
                sql:"SELECT *, ns1314 as nota FROM schoolsgrades_ns1314 "+
                "WHERE ST_DWithin("+
                 	"the_geom::geography,"+
                  "ST_MakePoint("+$scope.lon+","+$scope.lat+"),"+
                  "5*1000"+
                ")",
                interactivity:['nombre' , 'direccion', 'localidad','tipo', 'nota'],
                cartocss:angular.element("#geocode_css").text()
              }
        ]
      };

      cartodb.createLayer(map_object,layerSource)
        .addTo(map_object)
        .done(function(layer) {
          layer.setInteraction(true);
          cartodbSublayer.hide();
          cartodbSublayer=layer.getSubLayer(0);
          console.log("layer from CartoDB Server-->",layer.getSubLayer(0));

          //Ajusta el mapa a los resultados obtenidos
          cartodbSQL.getBounds(layerSource.sublayers[0].sql).done(function(bounds) {
            map_object.fitBounds(bounds);
            //Añade el hover en las Escuelas
            layer.leafletMap.viz.addOverlay({
                       type: 'tooltip',
                       layer: cartodbSublayer,
                       template: $('#infowindow_hover_template').html(),
                       position: 'top|right',
                       fields: [{ nombre: 'nombre' }]
                     });

            cartodbSublayer.show();
          });

        });

    };

});
