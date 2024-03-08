import {Component, OnDestroy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MapComponent} from "./components/map/map.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  EcoFabSpeedDialActionsComponent,
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent
} from "@ecodev/fab-speed-dial";
import {Subject, switchMap, takeUntil} from "rxjs";
import {MatBottomSheet, MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {AddPlantComponent, AddPlantResult} from "./components/add-plant/add-plant.component";
import {PlantsGatewayService} from "./gateway/plants-gateway.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapComponent, MatButtonModule, MatIconModule, MatBottomSheetModule, EcoFabSpeedDialComponent, EcoFabSpeedDialTriggerComponent, EcoFabSpeedDialActionsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  private readonly _destroyed$$ = new Subject<void>();
  private readonly _onAddClicked$$ = new Subject<void>();
  private readonly _onShowPlantsClicked$$ = new Subject<void>();

  constructor(private readonly bottomSheet: MatBottomSheet, private readonly plantsGatewayService: PlantsGatewayService) {
    this._onAddClicked$$.pipe(
      takeUntil(this._destroyed$$),
      switchMap(() => this.bottomSheet.open(AddPlantComponent, {
        hasBackdrop: false,
        disableClose: true,
        panelClass: 'add-plant-bottom-sheet',
      }).afterDismissed())).subscribe((result?: AddPlantResult) => {
      if (result)
        this.plantsGatewayService.addPlant({
          id: 0,
          location: result.location,
          species: result.species
        })
    });
  }

  public ngOnDestroy(): void {
    this._destroyed$$.next();
    this._destroyed$$.complete();
  }

  public onAddClicked(): void {
    this._onAddClicked$$.next();
  }

  public onShowPlantsClicked(): void {
    this._onShowPlantsClicked$$.next();
  }
}
