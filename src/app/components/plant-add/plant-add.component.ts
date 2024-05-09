import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {PlantLocation, PlantSpecies} from "../../models/plant";
import {PlantSpeciesGatewayService} from "../../gateway/plant-species-gateway.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MapService} from "../../services/map.service";
import {take} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UisTouchMoveDirective, UisTouchMoveEndedEvent} from "../../directives/uis-touch-move.directive";

export interface AddPlantBottomSheetResult {
  location: PlantLocation;
  species: PlantSpecies;
}

@Component({
  selector: 'app-plant-add',
  templateUrl: './plant-add.component.html',
  styleUrl: './plant-add.component.scss',
  hostDirectives: [{
    directive: UisTouchMoveDirective,
    outputs: ['uisTouchMoveEnded']
  }]
})
export class PlantAddComponent implements OnDestroy {
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
    private readonly uisPanDownDirective: UisTouchMoveDirective
  ) {
    this.mapService.selectedLocation.pipe(takeUntilDestroyed()).subscribe(location => {
      this.form.controls.selectedPlantLocation.setValue(location);
      this.mapService.addTemporaryPlantMarker(location);
    });
    this.mapService.currentLocation.pipe(take(1)).subscribe(location => {
      this.form.controls.selectedPlantLocation.setValue(location);
      this.mapService.addTemporaryPlantMarker(location);
    });
    this.uisPanDownDirective.uisTouchMoveEnded.pipe(takeUntilDestroyed()).subscribe(this.onTouchMoveEnded);
  }

  public ngOnDestroy(): void {
    this.mapService.removeTemporaryPlantMarkers();
  }

  public getSpeciesAutocompleteDisplayText(species: PlantSpecies | null): string {
    return species ? `${species.name} (${species.commonnames.join(', ')})` : '';
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
    } as AddPlantBottomSheetResult)
  }

  private onTouchMoveEnded = ($event: UisTouchMoveEndedEvent): void => {
    console.log($event)
    const panEndY = $event.y;
    const windowHeight = window.innerHeight;
    if (panEndY > windowHeight - 40) {
      this.onCloseClicked();
    } else {
      $event.container.style.position = '';
      $event.container.style.top = '';
    }
  }
}
