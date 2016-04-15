cartodbApp.controller('LayersExample1Controller', function($scope){
    
    var sublayer0Shown = true;
    // For storing the sublayers
    var sublayers = [];   
    var subLayerShown = {
        ns1314:true,
        aps1314:false
    };
    
    var mapLayerIds = {
        distritos:0,
        ns1314:1,
        aps1314:2
    };
    
    $scope.load = function () {
        
        var map_object = new L.Map('map', {
            center: [40.4000, -3.6833], // Madrid
            zoom: 10
        });        

        var layerSource = {
          user_name: 'jescacena',
          type: 'cartodb',
          sublayers: [
//              {
//            sql: "SELECT * FROM comarcas",
//            cartocss: '/** simple visualization */ #comarcas{  polygon-fill: #FF6600;  polygon-opacity: 0.7;  line-color: #FFF;  line-width: 0.5;  line-opacity: 1;}'      
//          }, 
          {
            sql: "SELECT * FROM distritos",
            cartocss: '/** choropleth visualization */ #distritos{  polygon-fill: #FFFFCC;  polygon-opacity: 0.8;  line-color: #FFF;  line-width: 0.5;  line-opacity: 1;} #distritos [ shape_len <= 94525.1562863] {   polygon-fill: #0C2C84; } #distritos [ shape_len <= 41015.5985406] { polygon-fill: #225EA8; } #distritos [ shape_len <= 34157.7345007] { polygon-fill: #1D91C0; } #distritos [ shape_len <= 28708.6231015] { polygon-fill: #41B6C4;} #distritos [ shape_len <= 18390.3658027] { polygon-fill: #7FCDBB;} #distritos [ shape_len <= 13401.4822549] { polygon-fill: #C7E9B4; } #distritos [ shape_len <= 11860.4645906] {  polygon-fill: #FFFFCC; }'
          },
          {
            sql: "SELECT * FROM schoolsgrades_aps1314",
            cartocss: '/** choropleth visualization */ #schoolsgrades_aps1314{  marker-fill-opacity: 0.8;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-width: 10;  marker-fill: #FFFFB2;  marker-allow-overlap: true;} #schoolsgrades_aps1314 [ aps1314 <= 100] {   marker-fill: #B10026;} #schoolsgrades_aps1314 [ aps1314 <= 97.73] {  marker-fill: #E31A1C; } #schoolsgrades_aps1314 [ aps1314 <= 96.24] { marker-fill: #FC4E2A;} #schoolsgrades_aps1314 [ aps1314 <= 94.12] { marker-fill: #FD8D3C;} #schoolsgrades_aps1314 [ aps1314 <= 91.21] { marker-fill: #FEB24C; } #schoolsgrades_aps1314 [ aps1314 <= 86.96] { marker-fill: #FED976; } #schoolsgrades_aps1314 [ aps1314 <= 75] { marker-fill: #FFFFB2;}'
          },
          {
            sql: "SELECT * FROM schoolsgrades_ns1314"
          }]
        }        

        // Pull tiles from OpenStreetMap
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map_object);
        
        // Add data layer to your map
        cartodb.createLayer(map_object,layerSource)
        .addTo(map_object)
        .done(function(layer) {
            console.log("JES layer-->" , layer);
          for (var i = 0; i < layer.getSubLayerCount(); i++) {
            sublayers[i] = layer.getSubLayer(i);
//            alert("Congrats, you added sublayer #" + i + "!");
          } 
            
            //Set style
            var simpleStyle = $("#ns1314_styles").text();
            sublayers[mapLayerIds['aps1314']].setCartoCSS(simpleStyle);
            
            //Initial layers display
            sublayers[mapLayerIds['ns1314']].show();
            sublayers[mapLayerIds['aps1314']].hide();
            sublayers[mapLayerIds['distritos']].hide();
        })
        .error(function(err) {
          console.log("error: " + err);
        }); 
    }
    
    $scope.showOnlyOneLayer = function(layerId) {
        //Hide all
        sublayers[mapLayerIds['ns1314']].hide();
        sublayers[mapLayerIds['aps1314']].hide();
        
        //Show only selected
        sublayers[mapLayerIds[layerId]].show();
        
    };
    
    $scope.toggleLayer = function(layerId) {
          if (subLayerShown[layerId]) {
            sublayers[mapLayerIds[layerId]].hide();
          } else {
            sublayers[mapLayerIds[layerId]].show();
          }
          subLayerShown[layerId] = !subLayerShown[layerId]; 
    }
        
});