import {Observable, of, ReplaySubject} from "rxjs";
import {Plant} from "../models/plant";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PlantsGatewayService {
  private readonly _plants: Plant[] = [];
  private readonly _newPlantAdded$$ = new ReplaySubject<Plant>(1);

  public getPlants(): Observable<Plant[]> {
    return of(this._plants);
  }

  public addPlant(plant: Plant): void {
    this._plants.push(plant);
    this._newPlantAdded$$.next(plant);
  }

  public newPlantAdded$(): Observable<Plant> {
    return this._newPlantAdded$$.asObservable();
  }
}
