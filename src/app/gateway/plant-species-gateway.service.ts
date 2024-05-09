import {Injectable} from "@angular/core";
import {PlantSpecies} from "../models/plant";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlantSpeciesGatewayService {
  private readonly apiEndpoint = `${environment.apiUrl}/species`;

  constructor(private readonly http: HttpClient) {
  }

  public getSpecies(): Observable<PlantSpecies[]> {
    return this.http.get<PlantSpecies[]>(this.apiEndpoint);
  }
}
