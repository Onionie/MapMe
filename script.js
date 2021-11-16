require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/rest/locator",
  "esri/Graphic",
  "esri/widgets/Locate",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery",
], function (
  esriConfig,
  Map,
  MapView,
  locator,
  Graphic,
  Locate,
  BasemapToggle,
  BasemapGallery
) {
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
      options.target.scale = 2500;
      return view.goTo(options.target);
    },
  });

  //Position feature top left
  view.ui.add(locate, "top-left");
});
