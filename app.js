require([
    'dojo/on',
    'dojo/ready',
    'dojo/DeferredList',

    'esri/map',
    'esri/arcgis/utils',

    'dojo/domReady!'
  ],

  function(on, ready, DefList, Map, arcgisUtils) {

    var maps = [];
    var active = false;

    /**
     * Creates a map using the ArcGIS JS API
     * @param  { String } id      DIV in which to place the map
     * @param  { String } basemap AGO Basemap name
     * @param  { Object } options Additional configuration options
     * @return { N/A }
     */
    function createMap(id, webmap, options) {

      arcgisUtils.createMap(webmap, id).then(function(response) {
        var map = response.map;
        map.disableScrollWheelZoom();
        on(map, 'pan-end', resizeAll);
        on(map, 'zoom-end', resizeAll);
        maps.push(map);
      });
    }

    function resizeAll(options) {
      if (!active) {
        active = true;
        var def = [];
        for (var i = 0; i < maps.length; i++) {
          if (options.target.id !== maps[i].id && options.target.loaded && options.target.extent !== maps[i].extent) {
            def.push(maps[i].setExtent(options.target.extent));
          }
        }
        var defs = new DefList(def);
        defs.then(function() {
          active = false;
        });
      }
    }

    ready(function() {
      createMap('mapDiv1', '781f281a901240d38fe15be7314ff771', null); // Topo
      createMap('mapDiv2', '27e0ef6113384d709782bb45774ba147', null); // Pinterest
      createMap('mapDiv3', '5d11b8f0d14342649abf35641b5a553e', null); // Watercolor
      createMap('mapDiv4', 'e9ef29f1e00a4ffa803f14360c6b4fac', null); // Crime
    });
  });