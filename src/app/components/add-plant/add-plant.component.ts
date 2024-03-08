import {Component, OnDestroy} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {PlantLocation, PlantSpecies} from "../../models/plant";
import {PlantSpeciesGatewayService} from "../../gateway/plant-species-gateway.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatBottomSheetModule, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatIconModule} from "@angular/material/icon";
import {MapService} from "../../service/map.service";
import {from, Subject, takeUntil, tap} from "rxjs";
import {LocationService} from "../../service/location.service";

export interface AddPlantResult {
  location: PlantLocation;
  species: PlantSpecies;
}

@Component({
  selector: 'app-add-plant',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatBottomSheetModule, MatIconModule, ReactiveFormsModule, AsyncPipe, NgIf],
  templateUrl: './add-plant.component.html',
  styleUrl: './add-plant.component.scss'
})
export class AddPlantComponent implements OnDestroy {
  private readonly _destroy$$ = new Subject<void>();

  readonly _species$$ = this.plantSpecies.getSpecies();
  readonly form = this.formBuilder.group({
    selectedPlantLocation: this.formBuilder.control<PlantLocation | null>(null, [Validators.required]),
    selectedPlantSpecies: this.formBuilder.control<PlantSpecies | null>(null, [Validators.required])
  });

  constructor(private formBuilder: FormBuilder,
              private _bottomSheetRef: MatBottomSheetRef<AddPlantComponent>,
              private readonly plantSpecies: PlantSpeciesGatewayService,
              private readonly mapService: MapService,
              private readonly locationService: LocationService) {
    this.mapService.selectedLocation$.pipe(takeUntil(this._destroy$$)).subscribe(location => {
      this.form.controls.selectedPlantLocation.setValue(location);
      this.mapService.addPlantMarker(location, {isTemporaryForAddOrEditPlant: true});
    });
    from(this.locationService.location).subscribe(location => {
      this.mapService.selectedLocation$ = location;
      this.mapService.zoomToLocation(location, 18);
    });
  }

  ngOnDestroy(): void {
    this._destroy$$.next();
    this._destroy$$.complete();
  }

  public getSpeciesAutocompleteDisplayText(plantSpecies: PlantSpecies | null): string {
    return plantSpecies ? `${plantSpecies.name} (${plantSpecies.commonNames.join(', ')})` : '';
  }

  public onCloseClicked(): void {
    this.mapService.removeTemporaryPlantMarkers();
    this._bottomSheetRef.dismiss();
  }

  public onAddClicked(): void {
    this.mapService.addPlantMarker(this.form.controls.selectedPlantLocation.value!, {isTemporaryForAddOrEditPlant: false});
    this._bottomSheetRef.dismiss({
      location: this.form.controls.selectedPlantLocation.value,
      species: this.form.controls.selectedPlantSpecies.value
    } as AddPlantResult)
  }
}
