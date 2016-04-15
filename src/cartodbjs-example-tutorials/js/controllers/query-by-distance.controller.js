cartodbApp.controller('QueryByDistanceController' , function($scope) {
    
    var layerUrl = 'https://jescacena.cartodb.com/api/v2/viz/97f7b53e-eb81-11e5-965b-0e5db1731f59/viz.json';

    var layerSource = {
          user_name: 'jescacena',
          type: 'cartodb',
          sublayers: [
              {
                sql: "SELECT * FROM schoolsgrades_aps1314",
                cartocss: '/** choropleth visualization */ #schoolsgrades_aps1314{  marker-fill-opacity: 0.8;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-width: 10;  marker-fill: #FFFFB2;  marker-allow-overlap: true;} #schoolsgrades_aps1314 [ aps1314 <= 100] {   marker-fill: #B10026;} #schoolsgrades_aps1314 [ aps1314 <= 97.73] {  marker-fill: #E31A1C; } #schoolsgrades_aps1314 [ aps1314 <= 96.24] { marker-fill: #FC4E2A;} #schoolsgrades_aps1314 [ aps1314 <= 94.12] { marker-fill: #FD8D3C;} #schoolsgrades_aps1314 [ aps1314 <= 91.21] { marker-fill: #FEB24C; } #schoolsgrades_aps1314 [ aps1314 <= 86.96] { marker-fill: #FED976; } #schoolsgrades_aps1314 [ aps1314 <= 75] { marker-fill: #FFFFB2;}'
              }
          ]
    }  
            
    var sublayers = [];
    
    var lon,
    lat,
    total = 10;

    var map_object = new L.Map('map', {
            center: [40.4000, -3.6833], // Madrid
            zoom: 10
        });        
    
    function mapToPosition(position) {
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      updateQuery();
      map_object.setView(new L.LatLng(lat,lon), 12);
      new L.CircleMarker([lat,lon],{radius: 4}).addTo(map_object);
    }

    
    // credit: http://html5doctor.com/finding-your-position-with-geolocation/
    function detectUserLocation(){
      if (navigator.geolocation) {
        var timeoutVal = 10 * 1000 * 1000;
        navigator.geolocation.watchPosition(
          mapToPosition, 
          alertError,
          { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
      }
      else {
        alert("Geolocation is not supported by this browser");
      }

      function alertError(error) {
        var errors = { 
          1: 'Permission denied',
          2: 'Position unavailable',
          3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
      }
    }    

    function updateQuery() {
        console.log("JES long,lat" , lon, lat);
      sublayers[0].set({
        sql: "WITH schools AS ( "+ 
               "SELECT cartodb_id, the_geom, the_geom_webmercator, nombre "+
                "FROM schoolsgrades_aps1314 ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint("+lon+","+lat+"),4326) ASC LIMIT "+total+
              ") "+
              
              "SELECT null as cartodb_id, "+
                "ST_MakeLine(ST_Transform(ST_SetSRID(ST_MakePoint("+lon+","+lat+"),4326),3857),the_geom_webmercator) as the_geom_webmercator, null as nombre "+
                "FROM schools "+
              
              "UNION ALL "+
              
              "SELECT cartodb_id, the_geom_webmercator, nombre FROM schools",
        cartocss: "#schoolsgrades_aps1314{[mapnik-geometry-type = 1]{text-name: [nombre]; text-face-name: 'DejaVu Sans Book'; text-size: 10; text-fill: #fff; text-allow-overlap: false; text-halo-fill: #F28F0D; text-halo-radius: 2;} [mapnik-geometry-type = 2]{line-color: green; line-opacity: 0.5;} } "
      });
    }

    
    $scope.load = function () {
          // Add a basemap to the map object just created
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map_object);
        
//        cartodb.createLayer(map_object, layerUrl)
        cartodb.createLayer(map_object, layerSource)
          .addTo(map_object)
          .on('done', function(layer) {
            // change the query for the first layer
//            var subLayerOptions = {
//              sql: "SELECT * FROM schoolsgrades_aps1314 LIMIT 2000",
//              cartocss: "/** simple visualization */ #schoolsgrades_aps1314{  marker-fill-opacity: 0.9; marker-line-color: #FFF; marker-line-width: 1; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-width: 10; marker-fill: #FF6600; marker-allow-overlap: true;}"
//            }

            var sublayer = layer.getSubLayer(0);

//            sublayer.set(subLayerOptions);

            sublayers.push(sublayer);
            detectUserLocation();
          }).on('error', function(e) {
            //log the error
            console.log("Error-->",e);
          });
    };
    

    });