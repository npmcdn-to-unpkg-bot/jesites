cartodbApp.controller('SchoolsSqlSelectorController' , function($scope, $timeout) {

  
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
          id: "distritos",
          sql: "SELECT * FROM distritos",
          cartocss: '/** choropleth visualization */ #distritos{  polygon-fill: #FFFFCC;  polygon-opacity: 0.8;  line-color: #FFF;  line-width: 0.5;  line-opacity: 1;} #distritos [ shape_len <= 94525.1562863] {   polygon-fill: #0C2C84; } #distritos [ shape_len <= 41015.5985406] { polygon-fill: #225EA8; } #distritos [ shape_len <= 34157.7345007] { polygon-fill: #1D91C0; } #distritos [ shape_len <= 28708.6231015] { polygon-fill: #41B6C4;} #distritos [ shape_len <= 18390.3658027] { polygon-fill: #7FCDBB;} #distritos [ shape_len <= 13401.4822549] { polygon-fill: #C7E9B4; } #distritos [ shape_len <= 11860.4645906] {  polygon-fill: #FFFFCC; }'
        },
        {
          id: "aps1314",
          sql: "SELECT * FROM schoolsgrades_aps1314",
          cartocss: '/** choropleth visualization */ #schoolsgrades_aps1314{  marker-fill-opacity: 0.8;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-width: 10;  marker-fill: #FFFFB2;  marker-allow-overlap: true;} #schoolsgrades_aps1314 [ aps1314 <= 100] {   marker-fill: #B10026;} #schoolsgrades_aps1314 [ aps1314 <= 97.73] {  marker-fill: #E31A1C; } #schoolsgrades_aps1314 [ aps1314 <= 96.24] { marker-fill: #FC4E2A;} #schoolsgrades_aps1314 [ aps1314 <= 94.12] { marker-fill: #FD8D3C;} #schoolsgrades_aps1314 [ aps1314 <= 91.21] { marker-fill: #FEB24C; } #schoolsgrades_aps1314 [ aps1314 <= 86.96] { marker-fill: #FED976; } #schoolsgrades_aps1314 [ aps1314 <= 75] { marker-fill: #FFFFB2;}'
        },
        {
          id: "ns1314",
          sql: "SELECT * FROM schoolsgrades_ns1314",
          cartocss: '/** choropleth visualization */ #schoolsgrades_ns1314{  marker-fill-opacity: 0.8;  marker-line-color: #FFF;  marker-line-width: 1;  marker-line-opacity: 1;  marker-width: 10;  marker-fill: #FFFFCC;  marker-allow-overlap: true; } #schoolsgrades_ns1314 [ ns1314 <= 8.05] {   marker-fill: #0C2C84; } #schoolsgrades_ns1314 [ ns1314 <= 7.08] { marker-fill: #225EA8; } #schoolsgrades_ns1314 [ ns1314 <= 6.7] { marker-fill: #1D91C0; } #schoolsgrades_ns1314 [ ns1314 <= 6.36] {  marker-fill: #41B6C4; } #schoolsgrades_ns1314 [ ns1314 <= 6.01] {  marker-fill: #7FCDBB; } #schoolsgrades_ns1314 [ ns1314 <= 5.68] { marker-fill: #C7E9B4; } #schoolsgrades_ns1314 [ ns1314 <= 5.15] { marker-fill: #FFFFCC; }'
        }]
      }   
  
  $scope.load = function() {
    
      //CartoDB Map centered in Madrid
      var map_object = new L.Map('map', {
          center: [40.4000, -3.6833], // Madrid
          zoom: 10
      }); 

      // For storing the sublayer
      var sublayer;

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map_object);

      // Add data layer to your map
      cartodb.createLayer(map_object,layerSource)
        .addTo(map_object)
        .done(function(layer) {
        
          for (var i = 0; i < layer.getSubLayerCount(); i++) {
            sublayers[i] = layer.getSubLayer(i);
//            alert("Congrats, you added sublayer #" + i + "!");
          } 
            
          //Set style for aps1314 initially
          var layerData = getSublayerData('aps1314');
          sublayers[mapLayerIds['aps1314']].setCartoCSS(layerData.cartocss);
          layerData = getSublayerData('ns1314');
          sublayers[mapLayerIds['ns1314']].setCartoCSS(layerData.cartocss);
          layerData = getSublayerData('distritos');
          sublayers[mapLayerIds['distritos']].setCartoCSS(layerData.cartocss);

          //Initial layers display
          sublayers[mapLayerIds['ns1314']].hide();
          sublayers[mapLayerIds['aps1314']].show();
          sublayers[mapLayerIds['distritos']].hide();        
        
//          var sublayer = layer.getSubLayer(0); 
//          var layerData = getSublayerData('aps1314');          
//          sublayer.setCartoCSS(layerData.cartocss);
//          sublayer.setSQL(layerData.sql);
//          sublayer.show();
          createSelector();
        
          cartodb.vis.Vis.addInfowindow(map_object, sublayers[mapLayerIds['aps1314']], ['nombre', 'ns1314' , 'direccion', 'localidad' , 'tipo']);
          cartodb.vis.Vis.addInfowindow(map_object, sublayers[mapLayerIds['ns1314']], ['nombre', 'aps1314' , 'direccion', 'localidad' , 'tipo']);
        })
        .error(function(err) {
          console.log("error: " + err);
        });    
    
      
    
  };
  
  
  // Create layer selector onclick listeners
  function createSelector(layer) {
    var condition = ""; // SQL or CartoCSS string
    var $options = $(".layer_selector").find("li");
    console.log("JES options-->"  , $options);
    $options.on("click", function(e) {
      console.log("JES e-->", e);
      
      var $li = $(e.currentTarget);
      
      console.log("JES li-->", $li);
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
        
        var layerData = getSublayerData(selected);
        
        $options.removeClass('sql_selected');
        if (selected !== "") {
          $li.addClass('sql_selected');
        }

        //layer.setSQL(layerData.sql);
        sublayers[mapLayerIds['ns1314']].hide();
        sublayers[mapLayerIds['aps1314']].hide();
        sublayers[mapLayerIds['distritos']].hide();  
        
        $timeout(function() {
          console.log("JES selected-->" ,selected);
          sublayers[mapLayerIds[selected]].show();  
        },500);
        
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