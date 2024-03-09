import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PlantLocation, PlantSpecies} from "../../models/plant";
import {PlantSpeciesGatewayService} from "../../gateway/plant-species-gateway.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MapService} from "../../services/map.service";
import {take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UisPanDirective, UisPanEndedEvent} from "../../directives/uis-pan.directive";

export interface AddPlantResult {
  location: PlantLocation;
  species: PlantSpecies;
}

@Component({
  selector: 'app-plant-add',
  templateUrl: './plant-add.component.html',
  styleUrl: './plant-add.component.scss',
  hostDirectives: [{
    directive: UisPanDirective,
    outputs: ['uisPanEnded']
  }]
})
export class PlantAddComponent {
  readonly _species$$ = this.plantSpeciesService.getSpecies();
  readonly form = this.formBuilder.group({
    selectedPlantLocation: this.formBuilder.control<PlantLocation | null>(null, [Validators.required]),
    selectedPlantSpecies: this.formBuilder.control<PlantSpecies | null>(null, [Validators.required])
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly bottomSheetRef: MatBottomSheetRef<PlantAddComponent>,
    private readonly plantSpeciesService: PlantSpeciesGatewayService,
    private readonly mapService: MapService,
    private readonly uisPanDownDirective: UisPanDirective
  ) {
    this.mapService.selectedLocation.pipe(takeUntilDestroyed()).subscribe(location => {
      this.form.controls.selectedPlantLocation.setValue(location);
      this.mapService.addTemporaryPlantMarker(location);
    });
    this.mapService.currentLocation.pipe(take(1)).subscribe(location => {
      this.form.controls.selectedPlantLocation.setValue(location);
      this.mapService.addTemporaryPlantMarker(location);
    });
    this.uisPanDownDirective.uisPanEnded.pipe(takeUntilDestroyed()).subscribe(this.onPanEnded);
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

  private onPanEnded = ($event: UisPanEndedEvent): void => {
    const panEndY = $event.panValues.center.y;
    const windowHeight = window.innerHeight;
    if (panEndY > windowHeight - 40) {
      this.onCloseClicked();
    } else {
      $event.container.style.position = '';
      $event.container.style.top = '';
    }
  }
}
