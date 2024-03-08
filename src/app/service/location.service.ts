import {Injectable} from "@angular/core";
import {PlantLocation} from "../models/plant";

@Injectable({providedIn: 'root'})
export class LocationService {
  get location(): Promise<PlantLocation> {
    return new Promise((resolve, reject) => {
      navigator.geolocation
        ? navigator.geolocation.getCurrentPosition(
          success =>
            resolve({
              lat: success.coords.latitude,
              lng: success.coords.longitude
            }),
          error => reject(error)
        )
        : reject('This Browser does not support Geolocation.');
    });
  }
}
