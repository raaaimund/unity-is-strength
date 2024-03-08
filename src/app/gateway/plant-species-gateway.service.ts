import {Injectable} from "@angular/core";
import {PlantSpecies} from "../models/plant";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlantSpeciesGatewayService {
  private readonly _species: PlantSpecies[] = [
    {
      id: 1,
      name: 'Blighia Sapida',
      commonNames: ['Akee']
    },
    {
      id: 2,
      name: 'Syzgium Malaccense',
      commonNames: ['Jamaican Apple']
    },
    {
      id: 3,
      name: 'Diospyros Nigra',
      commonNames: ['Black Sapote']
    },
    {
      id: 4,
      name: 'Cocos Nucifera',
      commonNames: ['Coconut']
    },
    {
      id: 5,
      name: 'Artocarpus Heterophyllus',
      commonNames: ['Jackfruit']
    },
    {
      id: 6,
      name: 'Averrhoa Carambola',
      commonNames: ['Starfruit']
    },
    {
      id: 7,
      name: 'Inga Edulis',
      commonNames: ['Regular Ice Cream Bean']
    },
    {
      id: 8,
      name: 'Inga Edulis',
      commonNames: ['Dwarf Ice Cream Bean']
    },
    {
      id: 9,
      name: 'Nephelium Lappaceum',
      commonNames: ['Rambutan']
    },
    {
      id: 10,
      name: 'Pouteria Caimito',
      commonNames: ['Abiu']
    }
  ];
  private readonly _species$$ = new BehaviorSubject<PlantSpecies[]>(this._species);

  public getSpecies(): Observable<PlantSpecies[]> {
    return this._species$$.asObservable();
  }
}
