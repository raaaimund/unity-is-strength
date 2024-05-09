import {Observable, of, ReplaySubject, switchMap, tap} from "rxjs";
import {Plant, PlantLocation, PlantSpecies} from "../models/plant";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

export interface PlantResponse {
  id: number;
  created_time: Date;
  location: PlantLocation;
  species: PlantSpecies;
}

export interface AddPlantRequest {
  created_time: Date;
  location: PlantLocation;
  species: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlantsGatewayService {
  private readonly apiEndpoint = `${environment.apiUrl}/plants?select=id,species:species(id,name,commonnames),location,created_time`;
  private readonly _newPlantAdded$$ = new ReplaySubject<Plant>(1);

  constructor(private readonly http: HttpClient) {
  }

  public getPlants(): Observable<Plant[]> {
    return this.http.get<PlantResponse[]>(this.apiEndpoint)
      .pipe(switchMap(plantResponses => of(plantResponses.map((plantResponse: PlantResponse): Plant => this.mapPlantResponseToPlant(plantResponse)))));
  }

  private mapPlantResponseToPlant(plantResponse: PlantResponse): Plant {
    return {
      id: plantResponse.id,
      created_time: plantResponse.created_time,
      location: plantResponse.location,
      species: plantResponse.species
    };
  }

  public addPlant(plant: Plant): void {
    const addPlantRequest: AddPlantRequest = {
      created_time: plant.created_time,
      location: plant.location,
      species: plant.species.id
    }
    this.http.post<Plant[]>(this.apiEndpoint, addPlantRequest, {headers: {'Prefer': 'return=representation'}})
      .pipe(switchMap((results) => of(results[0])))
      .subscribe(this._newPlantAdded$$);
  }

  public newPlantAdded$(): Observable<Plant> {
    return this._newPlantAdded$$.asObservable();
  }
}
