import {Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {MapService} from "../../service/map.service";
import {PlantsGatewayService} from "../../gateway/plants-gateway.service";

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [PlantsGatewayService]
})
export class MapComponent implements AfterViewInit {

  constructor(private mapService: MapService, private plantService: PlantsGatewayService) {
  }

  ngAfterViewInit() {
    this.mapService.map = L.map('map');
    this.plantService.getPlants().subscribe(plants => {
      this.mapService.addPlantMarkers(plants);
      this.mapService.centerMap(plants);
    });
  }
}
