import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import * as L from "leaflet";
import {LeafletMouseEvent} from "leaflet";
import {PlantLocation} from "../models/plant";

export interface PlantMarkerProperties {
  isTemporaryForAddOrEditPlant?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  private readonly _selectedLocation$$: Subject<PlantLocation> = new Subject<PlantLocation>();

  private _plantMarkers: L.Marker<PlantMarkerProperties>[] = [];
  private _map: L.Map | null = null;

  constructor() {
    L.Icon.Default.imagePath = 'assets/images/leaflet/';
  }

  set map(map: L.Map) {
    this._map = map.on('click', this.onMapClicked.bind(this));
    L.tileLayer(this.baseMapURl).addTo(this._map);
  }

  get map(): L.Map {
    if (!this._map) throw new Error('Map not initialized, set map before using it!');
    return this._map;
  }

  get selectedLocation$(): Observable<PlantLocation> {
    return this._selectedLocation$$.asObservable();
  }

  set selectedLocation$(location: PlantLocation) {
    this._selectedLocation$$.next(location);
  }

  public onMapClicked(event: LeafletMouseEvent) {
    this.selectedLocation$ = {
      lat: event.latlng.lat,
      lng: event.latlng.lng
    };
  }

  public addPlantMarkers(locations: PlantLocation[], properties: PlantMarkerProperties) {
    locations.map(location => this.toMarker(location, properties))
      .forEach(marker => {
        this._plantMarkers.push(marker);
        marker.addTo(this.map);
      });
  }

  public addPlantMarker(location: PlantLocation, properties: PlantMarkerProperties) {
    const markerToAdd = this.toMarker(location, properties);
    if (properties.isTemporaryForAddOrEditPlant) this.removeTemporaryPlantMarkers();
    this._plantMarkers.push(markerToAdd);
    markerToAdd.addTo(this.map);
  }

  public removeTemporaryPlantMarkers() {
    this._plantMarkers.filter(marker => marker.feature?.properties.isTemporaryForAddOrEditPlant).forEach(marker => marker.remove());
    this._plantMarkers = this._plantMarkers.filter(marker => !marker.feature?.properties.isTemporaryForAddOrEditPlant);
  }

  public centerMap(locations: PlantLocation[]) {
    const bounds = L.latLngBounds(locations.map(location => L.latLng(location.lat, location.lng)));
    this.map.fitBounds(bounds);
  }

  public zoomToLocation(location: PlantLocation, zoomLevel: number) {
    this.map.setView([location.lat, location.lng], zoomLevel);
  }

  private toMarker(location: PlantLocation, properties: PlantMarkerProperties): L.Marker<PlantMarkerProperties> {
    const marker = new L.Marker<PlantMarkerProperties>([location.lat, location.lng]);
    marker.feature = {
      type: 'Feature',
      properties: properties,
      geometry: {type: 'Point', coordinates: [location.lat, location.lng]}
    };
    return marker;
  }
}
