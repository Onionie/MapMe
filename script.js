require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/rest/locator",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/widgets/BasemapToggle",
], function (
  esriConfig,
  Map,
  MapView,
  locator,
  Graphic,
  Locate,
  BasemapToggle
) {
  //prettier-ignore
  esriConfig.apiKey ="AAPK8901ebc02b514937915f81d78ec61b7fStC7-kmQA7QW0y3Ddu1E7ZvmwKgCxO96JJ9Mbu83t21pWiR8a_K3930gRi0EMXqg";

  const map = new Map({
    basemap: "arcgis-navigation", // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [-117.1827978, 34.0588218], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "viewDiv", // Div element
  });

  /*--------------Locate Me Feature--------------*/
  //Locate feature
  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
  });

  //Position Locate feature top left
  view.ui.add(locate, "top-left");

  /*--------------Change Basemap Layer Feature--------------*/
  //Basemap Layer Feature
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery",
  });
  view.ui.add(basemapToggle, "bottom-right");

  /*--------------Find Places Feature--------------*/
  //prettier-ignore
  const locatorUrl ="http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

  // Find places and add them to the map
  function findPlaces(category, pt) {
    locator
      .addressToLocations(locatorUrl, {
        location: pt,
        categories: [category],
        maxLocations: 50,
        outFields: ["Place_addr", "PlaceName"],
      })

      .then(function (results) {
        view.popup.close();
        view.graphics.removeAll();
        results.forEach(function (result) {
          view.graphics.add(
            new Graphic({
              attributes: result.attributes, // Data attributes returned
              geometry: result.location, // Point returned
              symbol: {
                type: "simple-marker",
                color: "green",
                size: "12px",
                outline: {
                  color: "#ffffff",
                  width: "2px",
                },
              },

              popupTemplate: {
                title: "{PlaceName}", // Data attribute names
                content: "{Place_addr}",
              },
            })
          );
        });
      });
  }

  //custom form / search box
  const form = document.getElementById("form");
  const input = document.getElementById("search");

  //on submit, call findPlaces function and pass in value
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    findPlaces(input.value, view.center);
  });

  //Put Search box on top right
  view.ui.add(form, "top-right");

  //Search for places in center of map
  view.watch("stationary", function (val) {
    if (val) {
      findPlaces(input.value, view.center);
    }
  });

  /*--------------Locate Me Feature--------------*/
}); //End of require
