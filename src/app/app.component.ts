import {Component} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {PlantAddComponent, AddPlantBottomSheetResult} from "./components/plant-add/plant-add.component";
import {PlantsGatewayService} from "./gateway/plants-gateway.service";
import {Plant} from "./models/plant";
import {PlantListComponent} from "./components/plant-list/plant-list.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly bottomSheet: MatBottomSheet, private readonly plantsGatewayService: PlantsGatewayService) {
  }

  public onAddClicked(): void {
    this.bottomSheet.open(PlantAddComponent, {
      hasBackdrop: false,
      disableClose: true,
      panelClass: 'plant-bottom-sheet',
    })
      .afterDismissed()
      .subscribe((result?: AddPlantBottomSheetResult) => {
        if (result) {
          const newPlant: Plant = {
            id: 0,
            location: result.location,
            species: result.species
          };
          this.plantsGatewayService.addPlant(newPlant);
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
