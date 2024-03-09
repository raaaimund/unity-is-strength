import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {PlantsGatewayService} from "../../gateway/plants-gateway.service";
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Plant} from "../../models/plant";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MapService} from "../../services/map.service";
import {UisPanDirective, UisPanEndedEvent} from "../../directives/uis-pan.directive";

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss',
  hostDirectives: [{
    directive: UisPanDirective,
    outputs: ['uisPanEnded']
  }]
})
export class PlantListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns: string[] = ['plant-id', 'plant-name', 'plant-commonNames', 'plant-commands'];
  dataSource: MatTableDataSource<Plant> = new MatTableDataSource<Plant>([]);

  constructor(
    private readonly plantsService: PlantsGatewayService,
    private readonly bottomSheetRef: MatBottomSheetRef<PlantListComponent>,
    private readonly mapService: MapService,
    private readonly uisPanDownDirective: UisPanDirective
  ) {
    this.plantsService.getPlants().pipe(takeUntilDestroyed()).subscribe(plants => {
      this.dataSource = new MatTableDataSource<Plant>(plants);
    });
    this.uisPanDownDirective.uisPanEnded.pipe(takeUntilDestroyed()).subscribe(this.onPanEnded);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public onCloseClicked(): void {
    this.bottomSheetRef.dismiss();
  }

  public onZoomToLocationClicked(plant: Plant): void {
    this.mapService.zoomToLocation(plant.location, 18);
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
