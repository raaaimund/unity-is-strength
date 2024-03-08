import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {PlantsGatewayService} from "../../gateway/plants-gateway.service";
import {MatBottomSheetModule, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {Plant} from "../../models/plant";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MapService} from "../../service/map.service";

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatButtonModule, MatInputModule, MatBottomSheetModule, MatIconModule, MatTableModule, MatPaginatorModule, JsonPipe, AsyncPipe, NgIf],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss'
})
export class PlantListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns: string[] = ['plant-id', 'plant-name', 'plant-commonNames', 'plant-commands'];
  dataSource: MatTableDataSource<Plant> = new MatTableDataSource<Plant>([]);

  constructor(private readonly plantsService: PlantsGatewayService, private readonly bottomSheetRef: MatBottomSheetRef<PlantListComponent>, private readonly mapService: MapService) {
    this.plantsService.getPlants().pipe(takeUntilDestroyed()).subscribe(plants => {
      this.dataSource = new MatTableDataSource<Plant>(plants);

    });
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
}
