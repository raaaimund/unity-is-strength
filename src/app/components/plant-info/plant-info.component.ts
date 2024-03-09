import {Component, Inject} from '@angular/core';
import {Plant, PlantLocation, PlantSpecies} from "../../models/plant";
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {FormBuilder} from "@angular/forms";
import {MapService} from "../../services/map.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UisTouchMoveDirective, UisTouchMoveEndedEvent} from "../../directives/uis-touch-move.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-plant-info',
  templateUrl: './plant-info.component.html',
  styleUrl: './plant-info.component.scss',
  hostDirectives: [{
    directive: UisTouchMoveDirective,
    outputs: ['uisTouchMoveEnded']
  }]
})
export class PlantInfoComponent {
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
    private readonly snackBar: MatSnackBar,
    private readonly uisPanDownDirective: UisTouchMoveDirective
  ) {
    this.mapService.zoomToLocation(plantToEdit.location, 18);
    this.uisPanDownDirective.uisTouchMoveEnded.pipe(takeUntilDestroyed()).subscribe(this.onTouchMoveEnded);
  }

  public onCloseClicked(): void {
    this.bottomSheetRef.dismiss();
  }

  public getLocationDisplayText(): string {
    return `${this.plantToEdit.location.lat}, ${this.plantToEdit.location.lng}`;
  }

  public onCopied(wasCopied: boolean): void {
    if (wasCopied) this.snackBar.open('Copied to clipboard.', 'Thanks', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private onTouchMoveEnded = ($event: UisTouchMoveEndedEvent): void => {
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
