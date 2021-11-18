// setTimeout(function () {
//   alert(`- To pinpoint current location: Click on target button on top left of the screen.
// - Search for a Type of Place: You can search for type of places on top right search bar.
// - To switch map layer : Click on the bottom right corner of the screen. `);
// }, 6000);
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/rest/locator",
  "esri/widgets/Locate",
  "esri/widgets/BasemapToggle",
  "esri/Graphic",
  "esri/rest/route",
  "esri/rest/support/RouteParameters",
  "esri/rest/support/FeatureSet",
  "esri/widgets/Search",
], function (
  esriConfig,
  Map,
  MapView,
  locator,
  Locate,
  BasemapToggle,
  Graphic,
  route,
  RouteParameters,
  FeatureSet,
  Search
) {
  //prettier-ignore
  esriConfig.apiKey ="AAPK8901ebc02b514937915f81d78ec61b7fStC7-kmQA7QW0y3Ddu1E7ZvmwKgCxO96JJ9Mbu83t21pWiR8a_K3930gRi0EMXqg";

  const map = new Map({
    basemap: "arcgis-navigation", // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [-117.1827978, 34.0588218], // Longitude, latitude
    zoom: 16, // Zoom level
    container: "viewDiv", // Div element
  });

  // const search = new Search({
  //   //Add Search widget
  //   view: view,
  //   goToOverride: function (view, options) {
  //     options.target.scale = 000;
  //     return view.goTo(options.target);
  //   },
  // });
  // view.ui.add(search, "top-right"); //Add to the map

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

  //Find places and add them to the map
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
        view.graphics.removeAll(); //Removes existing added graphics on the map
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
                title: "{PlaceName}",
                content:
                  "{Place_addr}" +
                  "<br><br>" +
                  result.location.x.toFixed(5) +
                  "," +
                  result.location.y.toFixed(5),
              },
              goToOverride: function (view, options) {
                options.target.scale = 5000;
                return view.goTo(options.target);
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
  //When there's a change on the map, calls findPlaces() again
  view.watch("stationary", function (val) {
    if (val) {
      findPlaces(input.value, view.center);
    }
  });

  /*--------------Route Me Feature--------------*/
  /*
  Conflicts with other markers graphics because of view.graphics.removeAll();
  //prettier-ignore
  const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

  view.on("click", function (event) {
    if (view.graphics.length === 0) {
      addGraphic("origin", event.mapPoint);
      console.log(event);
    } else if (view.graphics.length === 1) {
      addGraphic("destination", event.mapPoint);

      getRoute(); // Call the route service
    } else {
      view.graphics.removeAll();
      addGraphic("origin", event.mapPoint);
    }
  });

  //Display White Marker on origin point
  function addGraphic(type, point) {
    const graphic = new Graphic({
      symbol: {
        type: "simple-marker",
        color: type === "origin" ? "white" : "black",
        size: "8px",
      },
      geometry: point,
    });
    view.graphics.add(graphic);
  }

  //Find Route
  function getRoute() {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: view.graphics.toArray(),
      }),
      returnDirections: true,
    });

    //Solve Method to get route
    route
      .solve(routeUrl, routeParams)
      .then(function (data) {
        data.routeResults.forEach(function (result) {
          console.log(data);
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3,
          };
          view.graphics.add(result.route);
        });

        // Display directions
        if (data.routeResults.length > 0) {
          const directions = document.createElement("ol");
          directions.classList =
            "esri-widget esri-widget--panel esri-directions__scroller";
          directions.style.marginTop = "0";
          directions.style.padding = "15px 15px 15px 30px";
          const features = data.routeResults[0].directions.features;
          console.log(features);

          // Show each direction
          features.forEach(function (result, i) {
            const direction = document.createElement("li");
            direction.innerHTML =
              result.attributes.text +
              " (" +
              result.attributes.length.toFixed(2) +
              " miles)";
            directions.appendChild(direction);
          });
          view.ui.empty("bottom-left");
          view.ui.add(directions, "bottom-left");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }*/
}); //End of require
