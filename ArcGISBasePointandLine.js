require([
    "esri/config",
    // "esri/Map", 
    "esri/views/MapView",
    'esri/widgets/Locate',
    'esri/widgets/Track',
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
    'esri/layers/FeatureLayer',
    'esri/rest/locator',
    'esri/widgets/Search',
    'esri/rest/route',
    'esri/rest/support/RouteParameters',
    'esri/rest/support/FeatureSet',
    'esri/WebMap',
    'esri/widgets/ScaleBar',
    'esri/widgets/Legend'
], 
function (esriConfig,
    // Map,
    MapView,
    Locate,
    Track, 
    Graphic,
    GraphicsLayer,
    FeatureLayer,
    locator,
    Search,
    route,
    RouteParameters,
    FeatureSet,
    WebMap,
    ScaleBar,
    Legend
    ) {
    esriConfig.apiKey = "AAPKa3c578c1b01d43c0a4cf804077dff7afjvjZiOoQnhSuqoIzkCPIZydZqOk7qbcte1Oju1LW3b-Qjh5RlLGUNArMHYpwRjEN";
/* const map = new Map({
basemap: "arcgis-navigation" // Basemap layer
});

const view = new MapView({
map: map,
center: [-78.50169,-0.21489],
zoom: 12, 
container: "viewDiv",
constraints: {
snapToZoom: false
} */

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
// add a point feature layer
const trailheadsLayer = new FeatureLayer({
    url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0'
});
map.add(trailheadsLayer);
// add a line feature layer, 0 to make sure layer is added to the top of the array drawn before trailheadsLayer
const trailsLayer = new FeatureLayer({
    url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0'
});
map.add(trailsLayer, 0);
// add a polygon feature layer
const parksLayer = new FeatureLayer({
    url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0'
});
map.add(parksLayer, 0)
/* error data
//create a place category selector
const places = ['Choose a place type:', 'parks and outdoors', 'coffee shops', 'gas stations', 'food', 'hotel'];
const select = document.createElement('select', '');
    select.setAttribute('class', 'esri-widget esri-select');
    select.setAttribute('style', "width:175px; font-family:'Avenir Next W00'; font-size: 1em")
places.forEach(function(p){
    const option = document.createElement('option');
    option.value = p;
    option.innerHTML = p;
    select.appendChild(option);
});
// set select element to topright corner of the view
view.ui.add(select, 'top-right');
// define the service url
const locatorUrl = 'http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer'
// search for places
function findPlaces(category, pt) {
    locator.addressToLocations(locatorUrl, {
        location: pt,
        categories: [category],
        maxLocations: 25,
        outFields: ['Place_addr', 'PlaceName']
    })

    .then(function(results) {
        view.popup.close();
        view.graphics.removeAll();
        
        results.forEach(function(result){
            view.graphics.add(
                new Graphic({
                    attributes: result.attributes, // data attributes returned
                    geometry: result.location, //point returned
                    symbol:{
                        type: 'simple-marker',
                        color: '#000000',
                        size: '12px',
                        outline:{
                            color: '#ffffff',
                            width: "2px"
                        }
                    },
                    popupTemplate:{
                        title: '{PlaceName}', //Data attribute names
                        content: "{Place_addr}"
                    }
                })
            );
        });
        // search for places in center of map
        view.watch('stationary', function(val){
            if (val) {
                findPlaces(select.value, view.center);
            }
        });
        // listen for category changes and find places
        select.addEventListener('change', function(event){
            findPlaces(event.target.value, view.center);
        });
    });
}
 */
// Reverse geocoding 
// add a search widget  
const search = new Search({
    view: view
});
    view.ui.add(search, 'top-right');

// define geocode service url
const serviceUrl = 'http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer';
// Reverse geocode is the process of converting a point to its nearest address or place.
view.on('click', function(evt){
    const params = {
        location: evt.mapPoint
    };
    locator.locationToAddress(serviceUrl, params)
        .then(function(response){ // show the address found
            const address = response.address;
            showAddress(address, evt.mapPoint);
        }, function(err){
            showAddress('No address found', evt.mapPoint);
        });
});
function showAddress(address, pt) {
    view.popup.open({
        title: + Math.round(pt.longitude *100000)/100000 + ','+ Math.round(pt.latitude * 100000)/100000,
        content: address,
        location: pt
    });
}

/* source error
// define route service url
const routeUrl = 'https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World';
view.on('click', function(event){
    if (view.graphics.length === 0){
        addGraphic('origin', event.mapPoint);
    } else if (view.graphics.length === 1){
        addGraphic('destination', event.mapPoint);
        getRoute(); // call the route service
    } else {
        view.graphics.removeAll();
        addGraphic('origin', event.mapPoint)
    }
});
function addGraphic(type, point){  // display a white marker for origin location and a black marker for destination
    const graphic = new Graphic({
        symbol: {
            type: 'simple-marker',
            color: (type === "origin") ? 'green': 'red',
            size: '8px'
        },
        geometry: point
    });
    view.graphics.add(graphic);
}
function getRoute(){
    const routeParams = new RouteParameters({ // RouteParameters see the properties for a list of all the properties that may be passed into the constructor
        stops: new FeatureSet({
            features: view.graphics.toArray()
        }),
        returnDirections: true  // this property to return directions and add them to the map as HTML elements
    });
    route.solve(routeUrl, routeParams) // call the solve method toget the route
        .then(function(data){
            data.routeResults.forEach(function(result){
                result.route.symbol = {
                    type: 'simple-line',
                    color: [5, 150, 225], // blue line
                    width: 3
                };
                view.graphics.add(result.route);
            });
            // display directions
            if (data.routeResults.length > 0){
                const directions = document.createElement('ol'); // ordered list element that will display if there are result returned to generate a route
                directions.classList = 'esri-widget esri-widget--panel esri-directions__scroller';
                directions.style.marginTop = '0';
                directions.style.padding = '15px 15px 15px 30px';
                const features = data.routeResults[0].directions.features;

                // show each direction
                features.forEach(function(result, i){ 
                    const direction = document.createElement('li'); // create a li element for each route to generate an ordered list of directions with their distances in miles
                    direction.innerHTML = result.attributes.text + '(' + result.attributes.length.toFixed(2) + 'miles)';
                    directions.appendChild(direction);
                });
                view.ui.empty('top-right');
                view.ui.add(directions, 'top-right');
            }
        })
        .catch(function(error){
            console.log(error);
        })
}
*/
// create a webmap
const webmap = new WebMap({
    portalItem:{
        id: '41281c51f9de45edaf1c8ed44bb10e30'
    }
});
const view = new MapView({
    container: 'viewDiv',
    map: webmap
})
// add widgets
const scalebar = new ScaleBar({
    view: view
});
view.ui.add(scalebar, 'bottom-left');

const legend = new Legend({
    view: view
});
view.ui.add(legend, 'top-right');
});
