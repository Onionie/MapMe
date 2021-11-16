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

  //Basemap Layer Feature
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery",
  });
  view.ui.add(basemapToggle, "bottom-right");

  //Locate feature
  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      view.graphics.removeAll();
      options.target.scale = 30000;
      return view.goTo(options.target);
    },
  });

  //Position feature top left
  view.ui.add(locate, "top-left");

  const places = [
    "Choose a place type...",
    "Cinema",
    "Coffee shop",
    "Food",
    "Gas station",
    "Hotel",
    "Parks and Outdoors",
  ];

  const select = document.createElement("select", "");
  select.setAttribute("class", "esri-widget esri-select");
  select.setAttribute(
    "style",
    "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em"
  );

  places.forEach(function (p) {
    const option = document.createElement("option");
    option.value = p;
    option.innerHTML = p;
    select.appendChild(option);
  });

  view.ui.add(select, "top-right");

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

  // Search for places in center of map
  view.watch("stationary", function (val) {
    if (val) {
      findPlaces(select.value, view.center);
    }
  });

  // Listen for category changes and find places
  select.addEventListener("change", function (event) {
    findPlaces(event.target.value, view.center);
  });
}); //End of require
