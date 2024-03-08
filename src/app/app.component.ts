import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MapComponent} from "./components/map/map.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  EcoFabSpeedDialActionsComponent,
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent
} from "@ecodev/fab-speed-dial";
import {MatBottomSheet, MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {PlantAddComponent, AddPlantResult} from "./components/plant-add/plant-add.component";
import {PlantsGatewayService} from "./gateway/plants-gateway.service";
import {MapService} from "./service/map.service";
import {Plant} from "./models/plant";
import {PlantListComponent} from "./components/plant-list/plant-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, MatButtonModule, MatIconModule, MatBottomSheetModule, EcoFabSpeedDialComponent, EcoFabSpeedDialTriggerComponent, EcoFabSpeedDialActionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly bottomSheet: MatBottomSheet, private readonly plantsGatewayService: PlantsGatewayService, private readonly mapService: MapService) {
  }

  public onAddClicked(): void {
    this.bottomSheet.open(PlantAddComponent, {
      hasBackdrop: false,
      disableClose: true,
      panelClass: 'plant-bottom-sheet',
    })
      .afterDismissed()
      .subscribe((result?: AddPlantResult) => {
        if (result) {
          const newPlant: Plant = {
            id: 0,
            location: result.location,
            species: result.species
          };
          this.plantsGatewayService.addPlant(newPlant);
          this.mapService.addPlantMarker(newPlant);
        }
      });
  }

  public onShowPlantsClicked(): void {
    this.bottomSheet.open(PlantListComponent, {
      hasBackdrop: false,
      disableClose: true,
      panelClass: 'plant-bottom-sheet',
    })
      .afterDismissed()
      .subscribe(() => {

      });
  }
}
