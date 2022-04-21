require([
    "esri/config",
    "esri/Map", 
    "esri/views/MapView",
    'esri/widgets/Locate',
    'esri/widgets/Track',
    'esri/Graphic',
    'esri/layers/GraphicsLayer'
], 
function (esriConfig,
    Map,
    MapView,
    Locate,
    Track, 
    Graphic,
    GraphicsLayer
    
    ) {
    esriConfig.apiKey = "AAPKa3c578c1b01d43c0a4cf804077dff7afjvjZiOoQnhSuqoIzkCPIZydZqOk7qbcte1Oju1LW3b-Qjh5RlLGUNArMHYpwRjEN";
const map = new Map({
basemap: "arcgis-topographic" // Basemap layer
});

const view = new MapView({
map: map,
center: [-40,28],
zoom: 2, 
container: "viewDiv",
constraints: {
snapToZoom: false
}

});
const locate = new Locate({
view:view,
useHeadingEnables:false,
goToOverride: function(view, options){
options.target.scale = 1500;
return view.goTo(options.target)
}

});

const track = new Track({
view:view,
graphic: new Graphic({
symbol:{
  type:'simple-marker',
  size:'12px',
  color:'green',
  outline:{
    color:'#efefef',
    width:'1.5px'
  }
}
}),
useHeadingEnabled: false
});
view.ui.add(track, 'top-left')
view.ui.add(locate, 'top-right')
/* add a graphics layer*/
const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer)
/* add a point graphic*/
const point = { //create a point
    type: 'point',
    longitude: -118,
    latitude: 34
};
const simpleMarkerSymbol = {
    type: 'simpleMarkerSymbol',
    color: [226,119,40], //orange RGB
    outline:{
        color:[225, 225, 255],
        width: 5 //whatever color
    }
};
const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol
});
graphicsLayer.add(pointGraphic);
/* add a line graphic */
const polyline = {
    type: 'polyline',
    paths: [
        [-118.821, 34],
        [-118.814, 34],
        [-118.808, 34]
    ]
};
const simpleLineSymbol = {
    type:'simple-line',
    color: [226,119,40],
    width: 5
};
const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol
});
graphicsLayer.add(polylineGraphic)
/* add a polygon graphic*/

});
