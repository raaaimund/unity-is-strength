import {Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {PlantLocation, PlantSpecies} from "../../models/plant";
import {PlantSpeciesGatewayService} from "../../gateway/plant-species-gateway.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatBottomSheetModule, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {MapService} from "../../service/map.service";
import {from} from "rxjs";
import {LocationService} from "../../service/location.service";
import {MatSelectModule} from "@angular/material/select";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface AddPlantResult {
  location: PlantLocation;
  species: PlantSpecies;
}

@Component({
  selector: 'app-plant-add',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatBottomSheetModule, MatIconModule, ReactiveFormsModule, AsyncPipe, NgIf],
  templateUrl: './plant-add.component.html',
  styleUrl: './plant-add.component.scss',
})
export class PlantAddComponent {

  readonly _species$$ = this.plantSpeciesService.getSpecies();
  readonly form = this.formBuilder.group({
    selectedPlantLocation: this.formBuilder.control<PlantLocation | null>(null, [Validators.required]),
    selectedPlantSpecies: this.formBuilder.control<PlantSpecies | null>(null, [Validators.required])
  });

  constructor(private readonly formBuilder: FormBuilder,
              private readonly bottomSheetRef: MatBottomSheetRef<PlantAddComponent>,
              private readonly plantSpeciesService: PlantSpeciesGatewayService,
              private readonly mapService: MapService,
              private readonly locationService: LocationService) {
    this.mapService.selectedLocation$.pipe(takeUntilDestroyed()).subscribe(location => {
      this.form.controls.selectedPlantLocation.setValue(location);
      this.mapService.addTemporaryPlantMarker(location);
    });
    from(this.locationService.location).subscribe(location => {
      this.mapService.selectedLocation$ = location;
      this.mapService.zoomToLocation(location, 18);
    });
  }

  public getSpeciesAutocompleteDisplayText(species: PlantSpecies | null): string {
    return species ? `${species.name} (${species.commonNames.join(', ')})` : '';
  }

  public onCloseClicked(): void {
    this.mapService.removeTemporaryPlantMarkers();
    this.bottomSheetRef.dismiss();
  }

  public onAddClicked(): void {
    this.mapService.removeTemporaryPlantMarkers();
    this.bottomSheetRef.dismiss({
      location: this.form.controls.selectedPlantLocation.value,
      species: this.form.controls.selectedPlantSpecies.value
    } as AddPlantResult)
  }

  onPan($event: any) {
    console.log($event);
  }
}
