import {BehaviorSubject, Observable} from "rxjs";
import {Plant} from "../models/plant";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PlantsGatewayService {
  private readonly _plants: Plant[] = [
    {
      id: 1,
      location: {
        lat: 48.8566,
        lng: 2.3522
      },
      species: {
        id: 1,
        name: 'Blighia Sapida',
        commonNames: ['Akee']
      }
    },
    {
      id: 2,
      location: {
        lat: 31.9539,
        lng: 35.9106
      },
      species: {
        id: 2,
        name: 'Syzgium Malaccense',
        commonNames: ['Jamaican Apple']
      }
    },
    {
      id: 3,
      location: {
        lat: 31.9539,
        lng: 35.9106
      },
      species: {
        id: 2,
        name: 'Syzgium Malaccense',
        commonNames: ['Jamaican Apple']
      }
    },
    {
      id: 4,
      location: {
        lat: 31.9539,
        lng: 35.9106
      },
      species: {
        id: 2,
        name: 'Syzgium Malaccense',
        commonNames: ['Jamaican Apple']
      }
    },
    {
      id: 5,
      location: {
        lat: 31.9539,
        lng: 35.9106
      },
      species: {
        id: 2,
        name: 'Syzgium Malaccense',
        commonNames: ['Jamaican Apple']
      }
    },
    {
      id: 6,
      location: {
        lat: 31.9539,
        lng: 35.9106
      },
      species: {
        id: 2,
        name: 'Syzgium Malaccense',
        commonNames: ['Jamaican Apple']
      }
    }
  ];
  private readonly _plants$$ = new BehaviorSubject<Plant[]>(this._plants);

  public getPlants(): Observable<Plant[]> {
    return this._plants$$.asObservable();
  }

  public addPlant(plant: Plant): void {
    this._plants.push(plant);
    this._plants$$.next([...this._plants, plant]);
  }
}
