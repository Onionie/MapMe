require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/rest/locator",
  "esri/Graphic",
  "esri/widgets/Locate",
], function (esriConfig, Map, MapView, locator, Graphic, Locate) {
  //prettier-ignore
  esriConfig.apiKey ="AAPK8901ebc02b514937915f81d78ec61b7fStC7-kmQA7QW0y3Ddu1E7ZvmwKgCxO96JJ9Mbu83t21pWiR8a_K3930gRi0EMXqg";

  const map = new Map({
    basemap: "arcgis-navigation", // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [-117.1803488, 34.1261445], // Longitude, latitude
    zoom: 13, // Zoom level
    container: "viewDiv", // Div element
  });

  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      options.target.scale = 3000;
      return view.goTo(options.target);
    },
  });
  view.ui.add(locate, "top-left");
});
