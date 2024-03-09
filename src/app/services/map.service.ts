import {Observable, ReplaySubject, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import * as L from "leaflet";
import {LeafletMouseEvent} from "leaflet";
import {Plant, PlantLocation} from "../models/plant";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PlantInfoComponent} from "../components/plant-info/plant-info.component";

export interface PlantMarkerFeatureProperties {
  isTemporaryForAddOrEditPlant: boolean
  plant?: Plant
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly _baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  private readonly _selectedLocation$$: Subject<PlantLocation> = new Subject<PlantLocation>();

  private _plantMarkers: L.Marker<PlantMarkerFeatureProperties>[] = [];
  private _map: L.Map | null = null;
  private _currentLocation$$: ReplaySubject<PlantLocation> = new ReplaySubject<PlantLocation>(1);

  constructor(private readonly bottomSheet: MatBottomSheet) {
    L.Icon.Default.imagePath = 'assets/images/leaflet/';
  }

  set map(mapElementName: string) {
    this._map = L.map(mapElementName, {
      attributionControl: true,
    }).on('click', this.onMapClicked.bind(this))
      .on('locationfound', this.onLocationFound.bind(this))
      .setView([0, 0], 3);
    L.tileLayer(this._baseMapURl, {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this._map);
    const locator = L.control.locate({
      setView: 'once',
      locateOptions: {
        maxZoom: 18,
        watch: false
      }
    }).addTo(this._map);
    locator.start();
    this._map.locate({setView: true, maxZoom: 18});
  }

  get map(): L.Map {
    if (!this._map) throw new Error('Map not initialized, set map before using it!');
    return this._map;
  }

  get selectedLocation(): Observable<PlantLocation> {
    return this._selectedLocation$$.asObservable();
  }

  set selectedLocation(location: PlantLocation) {
    this._selectedLocation$$.next(location);
  }

  get currentLocation(): Observable<PlantLocation> {
    return this._currentLocation$$.asObservable();
  }

  public onMapClicked(event: LeafletMouseEvent) {
    this.selectedLocation = {
      lat: event.latlng.lat,
      lng: event.latlng.lng
    };
  }

  public onLocationFound(event: L.LocationEvent) {
    this._currentLocation$$.next({
      lat: event.latlng.lat,
      lng: event.latlng.lng
    });
  }

  public addPlantMarkers(plants: Plant[]) {
    plants.map(plant => this.toMarker(plant.location, {
      isTemporaryForAddOrEditPlant: false,
      plant: plant
    }))
      .forEach(marker => {
        this._plantMarkers.push(marker);
        marker.addTo(this.map);
      });
  }

  public addPlantMarker(plant: Plant) {
    const markerToAdd = this.toMarker(plant.location, {
      isTemporaryForAddOrEditPlant: false,
      plant: plant
    });
    this._plantMarkers.push(markerToAdd);
    markerToAdd.addTo(this.map);
  }

  public addTemporaryPlantMarker(location: PlantLocation) {
    const markerToAdd = this.toMarker(location, {
      isTemporaryForAddOrEditPlant: true
    });
    this.removeTemporaryPlantMarkers();
    this._plantMarkers.push(markerToAdd);
    markerToAdd.addTo(this.map);
  }

  public removeTemporaryPlantMarkers() {
    this._plantMarkers.filter(marker => marker.feature?.properties.isTemporaryForAddOrEditPlant).forEach(marker => marker.remove());
    this._plantMarkers = this._plantMarkers.filter(marker => !marker.feature?.properties.isTemporaryForAddOrEditPlant);
  }

  public centerMapToAllMarkers(): void {
    if (this._plantMarkers.length) {
      const bounds = L.latLngBounds(this._plantMarkers.map(marker => marker.getLatLng()));
      this.map.fitBounds(bounds);
    }
  }

  public zoomToLocation(location: PlantLocation, zoomLevel: number) {
    this.map.setView([location.lat, location.lng], zoomLevel);
  }

  // https://developers.google.com/fonts/docs/material_icons#using_the_icons_in_html
  private toMarker(location: PlantLocation, properties: PlantMarkerFeatureProperties): L.Marker<PlantMarkerFeatureProperties> {
    const color = properties.isTemporaryForAddOrEditPlant ? 'purple' : 'indigo';
    const marker = new L.Marker<PlantMarkerFeatureProperties>([location.lat, location.lng], {
      icon: L.divIcon({
        className: 'plant-marker',
        html: `<span class="material-icons plant-marker-icon ${color}">park</span>`,
        iconSize: [48, 48],
        iconAnchor: [24, 48]
      })
    });
    marker.feature = {
      type: 'Feature',
      properties: properties,
      geometry: {type: 'Point', coordinates: [location.lat, location.lng]}
    };
    marker.on('click', () => {
      this.bottomSheet.open(PlantInfoComponent, {
        hasBackdrop: false,
        panelClass: 'plant-bottom-sheet',
        data: properties.plant
      });
    });
    return marker;
  }
}
