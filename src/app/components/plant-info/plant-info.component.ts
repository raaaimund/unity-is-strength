import {Component, Inject} from '@angular/core';
import {Plant, PlantLocation, PlantSpecies} from "../../models/plant";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgIf} from "@angular/common";
import {MapService} from "../../service/map.service";
import {PlantSpeciesGatewayService} from "../../gateway/plant-species-gateway.service";

@Component({
  selector: 'app-plant-info',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatBottomSheetModule, MatIconModule, ReactiveFormsModule, AsyncPipe, NgIf],
  templateUrl: './plant-info.component.html',
  styleUrl: './plant-info.component.scss'
})
export class PlantInfoComponent {
  readonly _species$$ = this.plantSpeciesService.getSpecies();
  readonly form = this.formBuilder.group({
    selectedPlantLocation: this.formBuilder.control<PlantLocation>({
      value: this.plantToEdit.location,
      disabled: true
    }, {
      nonNullable: true
    }),
    selectedPlantSpecies: this.formBuilder.control<PlantSpecies>({
      value: this.plantToEdit.species,
      disabled: true
    }, {
      nonNullable: true
    })
  });

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public plantToEdit: Plant,
    private formBuilder: FormBuilder,
    private readonly bottomSheetRef: MatBottomSheetRef<PlantInfoComponent>,
    private readonly mapService: MapService,
    private readonly plantSpeciesService: PlantSpeciesGatewayService
  ) {
    this.mapService.zoomToLocation(plantToEdit.location, 18);
  }

  public onCloseClicked(): void {
    this.bottomSheetRef.dismiss();
  }

  public getSpeciesDisplayText(species: PlantSpecies | null): string {
    return species ? `${species.name} (${species.commonNames.join(', ')})` : '';
  }

  public isPlantSelected = (p1: Plant, p2: Plant): boolean => (p1 && p2 ? p1.id === p2.id : p1 === p2)
}
