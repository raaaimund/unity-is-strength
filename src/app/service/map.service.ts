import {Observable, Subject} from "rxjs";
import {Injectable} from "@angular/core";
import * as L from "leaflet";
import {LeafletMouseEvent} from "leaflet";
import {Plant, PlantLocation} from "../models/plant";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PlantInfoComponent} from "../components/plant-info/plant-info.component";

export interface PlantMarkerOptions {
  isTemporaryForAddOrEditPlant: boolean
}

export interface PlantMarkerFeatureProperties {
  isTemporaryForAddOrEditPlant: boolean
  plant?: Plant
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private readonly baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  private readonly _selectedLocation$$: Subject<PlantLocation> = new Subject<PlantLocation>();

  private _plantMarkers: L.Marker<PlantMarkerFeatureProperties>[] = [];
  private _map: L.Map | null = null;

  constructor(private readonly bottomSheet: MatBottomSheet) {
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

  public centerMap(plants: Plant[]) {
    const bounds = L.latLngBounds(plants.map(plant => L.latLng(plant.location.lat, plant.location.lng)));
    this.map.fitBounds(bounds);
  }

  public zoomToLocation(location: PlantLocation, zoomLevel: number) {
    this.map.setView([location.lat, location.lng], zoomLevel);
  }

  private toMarker(location: PlantLocation, properties: PlantMarkerFeatureProperties): L.Marker<PlantMarkerFeatureProperties> {
    const marker = new L.Marker<PlantMarkerFeatureProperties>([location.lat, location.lng]);
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
