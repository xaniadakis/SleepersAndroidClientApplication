import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import maplibregl, {Map, Marker, NavigationControl, Popup, IControl} from 'maplibre-gl';
// @ts-ignore
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import {PostType} from "../../dto/post-type";

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.scss', '../tab2/tab2.page.scss']
})
export class MapComponent {

  @Input() withSearchFeature: boolean;

  map: Map | undefined;
  lat = 37.9696;
  lng = 23.7662;
  zoom = 14;
  di = [37.96962541227876, 23.7662103924327]

  KEY: string = "QWsLIbmeK39Y2fRMoy9S";

  geojson = {
    'type': 'FeatureCollection', 'features': [{
      'type': 'Feature', 'properties': {
        'className': 'diMarker', 'message': 'Hi from di UoA', 'iconSize': [60, 60]
      }, 'geometry': {
        'type': 'Uni', 'coordinates': this.di
      }
    }, {
      'type': 'Feature', 'properties': {
        'className': 'androidDeviceMarker', 'message': 'Hi this is me', 'iconSize': [50, 50]
      }, 'geometry': {
        'type': 'AndroidDevice1',
        'coordinates': [this.di[0] + 0.003, this.di[1] + 0.003]
      }
    },
      {
        'type': 'Feature', 'properties': {
          'className': 'iotDeviceMarker', 'message': 'Bye lad', 'iconSize': [40, 40]
        }, 'geometry': {
          'type': 'iotDevice1', 'coordinates': [this.di[0] - 0.005, this.di[1] - 0.0005]
        }
      },
      {
        'type': 'Feature', 'properties': {
          'className': 'iotDeviceMarker', 'message': 'Bye lad', 'iconSize': [40, 40]
        }, 'geometry': {
          'type': 'iotDevice2', 'coordinates': [this.di[0] + 0.005, this.di[1] + 0.005]
        }
      }]
  };

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor() {
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      // Use a minimalist raster style
      style: {
        'version': 8,
        'name': 'Blank',
        'center': [0, 0],
        'zoom': 0,
        'sources': {
          'raster-tiles': {
            'type': 'raster',
            'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            'tileSize': 256,
            'minzoom': 0,
            'maxzoom': 19
          }
        },
        'layers': [
          {
            'id': 'background',
            'type': 'background',
            'paint': {
              'background-color': '#e0dfdf'
            }
          },
          {
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles'
          }
        ],
      },
      center: [this.lng, this.lat],
      zoom: this.zoom,
      pitch: 40,
      bearing: 20,
      antialias: true
    });


    // this.map = new Map({
    //   container: this.mapContainer.nativeElement,
    //   // style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${this.KEY}`,
    //   style: `https://api.maptiler.com/maps/streets-v2/style.json?key=` + this.KEY,
    //   center: [this.lng, this.lat],
    //   zoom: this.zoom,
    //   pixelRatio: window.devicePixelRatio || 1
    // });

    this.map.addControl(new NavigationControl({}), 'bottom-left');
    this.geojson.features.forEach((marker) => {
      var popUp = '<div class="card text-black bg-info mb-0" style="max-width: 18rem;"><div class="card-header">' + marker.geometry.type + '</div><div class="card-body"><h5 class="card-title">' + marker.properties.message + '</h5><p class="card-text">Test</p></div></div>';
      this.createMarker(marker.properties.className, marker.geometry.coordinates[0], marker.geometry.coordinates[1], popUp, marker.properties.message);
    });

    // this.map.addControl(new NavigationControl({}));
    // new Marker({color: "#FF0000"})
    //   .setLngLat([139.7525, 35.6846])
    //   .addTo(this.map);

    if(this.withSearchFeature) {
      // Functions should return Carmen GeoJSON https://github.com/mapbox/carmen/blob/master/carmen-geojson.md
      // View config definitions in our [documentation](https://github.com/maplibre/maplibre-gl-geocoder/blob/master/API.md#setgeocoderapi)
      var geocoderApi = {
        forwardGeocode: async (config: any) => {
          console.log("QUERY: " + config.query);
          const features = [];
          try {
            let request =
              'https://nominatim.openstreetmap.org/search?q=' +
              config.query +
              '&format=geojson&polygon_geojson=1&addressdetails=1';
            const response = await fetch(request);
            const geojson = await response.json();
            for (let feature of geojson.features) {
              let center = [
                feature.bbox[0] +
                (feature.bbox[2] - feature.bbox[0]) / 2,
                feature.bbox[1] +
                (feature.bbox[3] - feature.bbox[1]) / 2
              ];
              let point = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: center
                },
                place_name: feature.properties.display_name,
                properties: feature.properties,
                text: feature.properties.display_name,
                place_type: ['place'],
                center: center
              };
              features.push(point);
            }
          } catch (e) {
            console.error(`Failed to forwardGeocode with error: ${e}`);
          }
          return {
            features: features
          };
        }
      };
      var render = function (item: any) {
        // Render as a suggestion
        if (!item.geometry) {
          var suggestionString = item.text;
          // var indexOfMatch = suggestionString
          //   .toLowerCase()
          //   .indexOf(this.query.toLowerCase());
          // var lengthOfMatch = this.query.length;
          // var beforeMatch = suggestionString.substring(0, indexOfMatch);
          var match = suggestionString
          //   .substring(
          //   indexOfMatch,
          //   indexOfMatch + lengthOfMatch
          // );
          var afterMatch = suggestionString
          //   .substring(
          //   indexOfMatch + lengthOfMatch
          // );

          return (
            '<div class="mapboxgl-ctrl-geocoder--suggestion maplibregl-ctrl-geocoder--suggestion">' +
            '<div class="mapboxgl-ctrl-geocoder--suggestion-info maplibregl-ctrl-geocoder--suggestion-info">' +
            '<span class="mapboxgl-ctrl-geocoder--suggestion-match maplibregl-ctrl-geocoder--suggestion-match">' +
            match +
            "</div>" +
            "</div>" +
            "</div>"
          );
        } else {
          // render as a search result
          var placeName = item.place_name.split(",");
          return (
            '<div class="mapboxgl-ctrl-geocoder--result maplibregl-ctrl-geocoder--result">' +
            "<div>" +
            '<div class="mapboxgl-ctrl-geocoder--result-title maplibregl-ctrl-geocoder--result-title">' +
            placeName +
            // placeName[0] +
            // "</div>" +
            // '<div class="mapboxgl-ctrl-geocoder--result-address maplibregl-ctrl-geocoder--result-address">' +
            // placeName.splice(1, placeName.length).join(",") +
            "</div>" +
            "</div>" +
            "</div>"
          );
        }
      }
      // Pass in or define a geocoding API that matches the above
      const geocoder = new MaplibreGeocoder(geocoderApi, {
        maplibregl: maplibregl,
        popup: true,
        render: render,
        zoom: 14
      });

      // const geocodeControl = new GeocodeControl();
      // @ts-ignore
      this.map.addControl(geocoder, "top-left");
    }
  }

  createMarker(className: string, lat: number, lng: number, popup: string, message: string) {
    var el = document.createElement('div');
    el.className = className;
    el.draggable = false;
    // el.addEventListener('click', function () {
    //     window.alert(message);
    // });
    return new Marker(el).setLngLat([lng, lat])
      .setPopup(new Popup().setHTML(popup))
      .addTo(<Map>this.map);
  }

  updateMap() {
    const basemapEnum = "ArcGIS:Navigation";
    const map = new Map({
      container: "map",
      style: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${this.KEY}`,
      zoom: this.zoom,
      center: [151.2093, -33.8688] // Sydney
    });
  }

  addGeoControl() {
    if (this.map != null) {
      const geocodeControl = new GeocodeControl();
      // @ts-ignore
      this.map.addControl(geocodeControl, "top-right");
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}

class GeocodeControl {
  onAdd(map: Map) {
    const template = document.createElement("template");
    template.innerHTML = `
            <div id="geocode-container" style="z-index: 99999999">
              <ion-input id="geocode-input" class="maplibregl-ctrl" type="text" placeholder="Enter an address or place e.g. 1 York St" size="50" />
              <ion-button id="geocode-button" class="maplibregl-ctrl">Geocode</ion-button>
            </div>
          `;

    return template.content;
  }
}
