import {Component, AfterViewInit} from '@angular/core';
import {MapService} from "../../services/map.service";
import {PlantsGatewayService} from "../../gateway/plants-gateway.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {

  constructor(private mapService: MapService, private plantService: PlantsGatewayService) {
    this.plantService.newPlantAdded$().pipe(takeUntilDestroyed()).subscribe(plant => {
      this.mapService.addPlantMarker(plant);
    });
  }

  ngAfterViewInit() {
    this.mapService.map = 'map';
    this.plantService.getPlants().subscribe(plants => {
      this.mapService.addPlantMarkers(plants);
    });
    this.mapService.centerMapToAllMarkers();
  }
}
