import {Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {of, switchMap} from "rxjs";
import {MapService} from "../../service/map.service";
import {PlantsGatewayService} from "../../gateway/plants-gateway.service";
import {Plant} from "../../models/plant";

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [PlantsGatewayService]
})
export class MapComponent implements AfterViewInit {
  constructor(private mapService: MapService, private plantService: PlantsGatewayService) {
    this.plantService.getPlants().subscribe();
  }

  ngAfterViewInit() {
    this.mapService.map = L.map('map');
    this.plantService.getPlants().pipe(
      switchMap((plants: Plant[]) =>
        of(plants.map(plant => plant.location))
      )).subscribe(markers => {
      this.mapService.addPlantMarkers(markers, {isTemporaryForAddOrEditPlant: false});
      this.mapService.centerMap(markers);
    });
  }
}
